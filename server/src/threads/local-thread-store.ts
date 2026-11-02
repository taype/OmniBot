import type { Message } from "@ag-ui/client";
import { and, asc, eq, sql } from "drizzle-orm";
import type { Database } from "../db/client";
import {
  localThreadLocks,
  localThreadMessages,
  localThreads,
} from "../db/schema/threads";

/**
 * The local stand-in for CopilotKit Intelligence's thread store, used when `LOCAL_MODE` is on and
 * no cloud is configured.
 *
 * Three things the platform keeps for a conversation, kept in OpenBot's own PostgreSQL instead:
 *
 * 1. the thread row — whose conversation this is, and with which Bot;
 * 2. the transcript — the rows a reload is rebuilt from, in the platform's `ThreadMessage` shape so
 *    the runtime's own endpoints, `history()`, and the app's merge path see what they already know;
 * 3. the run lock — one run at a time per conversation, with the same 120-second lease the platform
 *    issues, so an unattended turn and a person's next message cannot write over each other.
 *
 * Why a wrapper at all: `mountCopilotRuntime` hands out a `history()` reader and a `ThreadLock`
 * port, and `createTurnRunner` takes an `IntelligenceLike` — all structural types written exactly
 * so a second implementation could slot in (see `toolkit/run-turn.ts:122-151`). This is that
 * implementation.
 */

export type StoredThreadMessage = {
  id: string;
  role: string;
  content?: unknown;
  activityType?: string;
  toolCalls?: { id: string; name: string; args: string }[];
  toolCallId?: string;
};

/** The lock is taken by a different run: the platform's 409, as an error a caller can recognise. */
export class LocalThreadLockBusy extends Error {
  readonly status = 409;
  constructor(threadId: string) {
    super(`Thread lock denied for ${threadId}: another run holds it.`);
  }
}

function toRow(message: Message) {
  const record = message as unknown as {
    id: string;
    role: string;
    content?: unknown;
    activityType?: string;
    toolCallId?: string;
    toolCalls?: {
      id: string;
      type?: string;
      function?: { name?: string; arguments?: string };
    }[];
  };
  return {
    messageId: record.id,
    role: record.role,
    content: { value: record.content },
    activityType: record.activityType ?? null,
    toolCalls:
      record.toolCalls?.map((call) => ({
        id: call.id,
        name: call.function?.name ?? "",
        args: call.function?.arguments ?? "",
      })) ?? null,
    toolCallId: record.toolCallId ?? null,
  };
}

function fromRow(
  row: typeof localThreadMessages.$inferSelect,
): StoredThreadMessage {
  return {
    id: row.messageId,
    role: row.role,
    ...(row.content === null
      ? { content: "" }
      : { content: row.content.value }),
    ...(row.activityType ? { activityType: row.activityType } : {}),
    ...(row.toolCalls
      ? { toolCalls: row.toolCalls.map((call) => ({ ...call })) }
      : {}),
    ...(row.toolCallId ? { toolCallId: row.toolCallId } : {}),
  };
}

export function createLocalThreadStore(database: Database) {
  return {
    /** Only the thread row is needed for reads that never saw a message; messages imply it too. */
    async ensureThread(input: {
      threadId: string;
      userId?: string;
      agentId?: string;
    }): Promise<void> {
      await database
        .insert(localThreads)
        .values({
          id: input.threadId,
          userId: input.userId ?? "",
          agentId: input.agentId ?? "",
        })
        .onConflictDoUpdate({
          target: localThreads.id,
          set: {
            updatedAt: sql`now()`,
            ...(input.userId ? { userId: input.userId } : {}),
            ...(input.agentId ? { agentId: input.agentId } : {}),
          },
        });
    },

    /**
     * Write every message this run knows about, idempotent on `(thread, message id)`.
     *
     * The browser sends the whole conversation each run and a headless turn seeds its own history,
     * so the same rows arrive repeatedly. Only new ones are inserted, at the transcript's tail;
     * an id already present keeps its position and is not rewritten.
     */
    async appendMessages(input: {
      threadId: string;
      userId?: string;
      agentId?: string;
      messages: readonly Message[];
    }): Promise<void> {
      await this.ensureThread({
        threadId: input.threadId,
        ...(input.userId ? { userId: input.userId } : {}),
        ...(input.agentId ? { agentId: input.agentId } : {}),
      });
      if (input.messages.length === 0) return;
      const rows = input.messages.map(toRow);
      await database.transaction(async (tx) => {
        const [last] = await tx
          .select({ position: localThreadMessages.position })
          .from(localThreadMessages)
          .where(eq(localThreadMessages.threadId, input.threadId))
          .orderBy(sql`${localThreadMessages.position} desc`)
          .limit(1);
        let next = (last?.position ?? -1) + 1;
        for (const row of rows) {
          await tx
            .insert(localThreadMessages)
            .values({
              threadId: input.threadId,
              ...row,
              position: next,
            })
            .onConflictDoUpdate({
              target: [
                localThreadMessages.threadId,
                localThreadMessages.messageId,
              ],
              set: {
                role: sql`excluded.role`,
                content: sql`excluded.content`,
                activityType: sql`excluded.activity_type`,
                toolCalls: sql`excluded.tool_calls`,
                toolCallId: sql`excluded.tool_call_id`,
              },
            })
            .returning({ position: localThreadMessages.position });
          next += 1;
        }
      });
    },

    async getMessages(threadId: string): Promise<StoredThreadMessage[]> {
      const rows = await database
        .select()
        .from(localThreadMessages)
        .where(eq(localThreadMessages.threadId, threadId))
        .orderBy(
          asc(localThreadMessages.position),
          asc(localThreadMessages.createdAt),
        );
      return rows.map(fromRow);
    },

    async getThread(
      threadId: string,
    ): Promise<{ id: string; userId: string; agentId: string } | null> {
      const [row] = await database
        .select()
        .from(localThreads)
        .where(eq(localThreads.id, threadId))
        .limit(1);
      return row
        ? { id: row.id, userId: row.userId, agentId: row.agentId }
        : null;
    },

    /** The conversations the runner's in-process cache should warm from, newest first. */
    async recentThreads(limit: number): Promise<{ id: string }[]> {
      return database
        .select({ id: localThreads.id })
        .from(localThreads)
        .orderBy(sql`${localThreads.updatedAt} desc`)
        .limit(limit);
    },

    /**
     * Take the conversation's lock, or answer that somebody else holds it.
     *
     * The same rule the platform applies: a different live run refuses (the caller waits and retries
     * rather than two runs writing over each other); the same run id re-acquires (a retry of one
     * dispatch); an expired lease can be taken. The lease is the platform's 120 seconds by default.
     */
    async acquireLock(input: {
      threadId: string;
      runId: string;
      userId?: string;
      ttlSeconds?: number;
    }): Promise<{ runId: string }> {
      const ttl = Math.max(1, Math.floor(input.ttlSeconds ?? 120));
      try {
        const held = await database.transaction(async (tx) => {
          const [row] = await tx
            .select()
            .from(localThreadLocks)
            .where(eq(localThreadLocks.threadId, input.threadId))
            .for("update")
            .limit(1);
          const now = Date.now();
          if (row) {
            const expired = row.expiresAt.getTime() <= now;
            if (!expired && row.runId !== input.runId) return false;
            await tx
              .update(localThreadLocks)
              .set({
                runId: input.runId,
                userId: input.userId ?? row.userId,
                expiresAt: new Date(now + ttl * 1000),
              })
              .where(eq(localThreadLocks.threadId, input.threadId));
            return true;
          }
          await tx.insert(localThreadLocks).values({
            threadId: input.threadId,
            runId: input.runId,
            userId: input.userId ?? "",
            expiresAt: new Date(now + ttl * 1000),
          });
          return true;
        });
        if (!held) throw new LocalThreadLockBusy(input.threadId);
        return { runId: input.runId };
      } catch (error) {
        if (error instanceof LocalThreadLockBusy) throw error;
        // A concurrent first insert hits the primary key: somebody else just took it.
        throw new LocalThreadLockBusy(input.threadId);
      }
    },

    /** Extend the lease. A lock released out from under this run surfaces as a busy error. */
    async renewLock(input: {
      threadId: string;
      runId: string;
      ttlSeconds?: number;
    }): Promise<void> {
      const ttl = Math.max(1, Math.floor(input.ttlSeconds ?? 120));
      const updated = await database
        .update(localThreadLocks)
        .set({ expiresAt: new Date(Date.now() + ttl * 1000) })
        .where(
          and(
            eq(localThreadLocks.threadId, input.threadId),
            eq(localThreadLocks.runId, input.runId),
          ),
        )
        .returning({ threadId: localThreadLocks.threadId });
      if (updated.length === 0) throw new LocalThreadLockBusy(input.threadId);
    },

    /** Give the lock back. Missing is success: the TTL was the fallback. */
    async cleanupLock(input: {
      threadId: string;
      runId: string;
    }): Promise<void> {
      await database
        .delete(localThreadLocks)
        .where(
          and(
            eq(localThreadLocks.threadId, input.threadId),
            eq(localThreadLocks.runId, input.runId),
          ),
        );
    },
  };
}

export type LocalThreadStore = ReturnType<typeof createLocalThreadStore>;
