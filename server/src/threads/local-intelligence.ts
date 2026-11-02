import type { ThreadLock } from "@openbot/toolkit/ports";
import type { LocalThreadStore } from "./local-thread-store";
import { LocalThreadLockBusy } from "./local-thread-store";

/**
 * The local replacement for the two Intelligence faces a headless turn uses.
 *
 * `createTurnRunner` takes an `IntelligenceLike` (a structural, five-method view of the platform
 * client — see `toolkit/run-turn.ts:122-151`) and `mountCopilotRuntime` hands out a `ThreadLock`
 * port. Both are narrow on purpose, so one store can back both without either caller knowing
 * whether the answer came from PostgreSQL or a gateway.
 *
 * The method names keep the cloud client's spelling (`ɵ`-prefixed where the platform's are) because
 * that is the interface the turn code is written against; nothing here is network-bound.
 */
export function createLocalIntelligence(store: LocalThreadStore) {
  return {
    async getOrCreateThread(input: {
      threadId: string;
      userId: string;
      agentId: string;
    }): Promise<void> {
      await store.ensureThread(input);
    },

    /**
     * The thread's history, in the platform's row shape.
     *
     * `userId` is accepted for signature compatibility and deliberately not used to filter: a thread
     * id is unguessable, this store is asked by the runtime's own history route which has already
     * identified the caller, and a routine's owner is the person the thread belongs to. Ownership
     * of the first write is recorded on the row when it is known.
     */
    async getThreadMessages(input: {
      threadId: string;
      userId: string;
    }): Promise<{
      messages: import("./local-thread-store").StoredThreadMessage[];
    }> {
      return { messages: await store.getMessages(input.threadId) };
    },

    async getThread(input: {
      threadId: string;
      userId: string;
    }): Promise<{ id: string } | null> {
      return store.getThread(input.threadId);
    },

    async ɵacquireThreadLock(input: {
      threadId: string;
      runId: string;
      userId: string;
      agentId: string;
      ttlSeconds?: number;
    }): Promise<{ runId: string }> {
      return store.acquireLock({
        threadId: input.threadId,
        runId: input.runId,
        userId: input.userId,
        ...(input.ttlSeconds ? { ttlSeconds: input.ttlSeconds } : {}),
      });
    },

    async ɵrenewThreadLock(input: {
      threadId: string;
      runId: string;
      ttlSeconds: number;
    }): Promise<void> {
      await store.renewLock(input);
    },

    async ɵcleanupThreadLock(input: {
      threadId: string;
      runId: string;
    }): Promise<void> {
      await store.cleanupLock(input);
    },
  };
}

export type LocalIntelligence = ReturnType<typeof createLocalIntelligence>;

/**
 * The same lock, as `mountCopilotRuntime` hands it out.
 *
 * `ThreadLock.acquire` answers `null` for "somebody else is running here" and throws for anything
 * else — the platform's own contract (`toolkit/copilotkit/thread-lock.ts:36-109`). A busy lock
 * arrives as `LocalThreadLockBusy` with `status: 409`, which is exactly how the turn code decides
 * "wait and retry" from "raise".
 */
export function createLocalThreadLock(store: LocalThreadStore): ThreadLock {
  return {
    acquire: async (input) => {
      try {
        return await store.acquireLock(input);
      } catch (error) {
        if (error instanceof LocalThreadLockBusy) return null;
        throw error;
      }
    },
    renew: async (input) => {
      await store.renewLock(input);
    },
    release: async (input) => {
      await store.cleanupLock(input);
    },
  };
}

/**
 * A thread's messages as the platform-shaped `ThreadMessage[]` that `history()` promises.
 *
 * `copilot.ts`'s `history` is read by a Bot-to-Bot hop to seed the asking conversation; it must be
 * the same rows the browser would have been given, which is what the store returns.
 */
export async function readLocalHistory(
  store: LocalThreadStore,
  input: { threadId: string },
): Promise<import("./local-thread-store").StoredThreadMessage[]> {
  return store.getMessages(input.threadId);
}
