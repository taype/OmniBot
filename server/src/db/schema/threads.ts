import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { jsonb } from "./json";

/**
 * Local-mode thread state, for a deployment with no CopilotKit Intelligence.
 *
 * The cloud keeps these three things for a deployment that uses it: a thread row (who, which Bot),
 * the transcript rows a conversation is rebuilt from, and the run lock that keeps two runs off one
 * conversation. Local mode keeps them here instead, in the same PostgreSQL the audit trail lives in,
 * so a conversation survives a restart exactly like a permitted action does.
 *
 * Shape notes, mirroring what the platform hands back so nothing between them has to change:
 * - a message row is the platform's `ThreadMessage`: flat `toolCalls` of `{id, name, args}`,
 *   `activityType` for activity rows, `toolCallId` for a result that answers a call;
 * - `content` is wrapped in `{ value }` because the jsonb helper stores objects and a message's
 *   content may be a string or a multimodal array;
 * - `position` is the row's place in the transcript, assigned on first write and never moved, so a
 *   re-sent message (the browser sends the whole conversation every run) updates in place.
 */

export const localThreads = pgTable(
  "local_threads",
  {
    id: text("id").primaryKey(),
    /** Empty when the first write did not know the person: a browser run resolves history by thread. */
    userId: text("user_id").notNull().default(""),
    agentId: text("agent_id").notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("local_threads_user_idx").on(table.userId)],
);

export const localThreadMessages = pgTable(
  "local_thread_messages",
  {
    threadId: text("thread_id").notNull(),
    messageId: text("message_id").notNull(),
    role: text("role").notNull(),
    content: jsonb("content").$type<{ value: unknown }>(),
    activityType: text("activity_type"),
    toolCalls:
      jsonb("tool_calls").$type<{ id: string; name: string; args: string }[]>(),
    toolCallId: text("tool_call_id"),
    position: integer("position").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("local_thread_messages_pk").on(table.threadId, table.messageId),
    index("local_thread_messages_thread_idx").on(
      table.threadId,
      table.position,
    ),
  ],
);

export const localThreadLocks = pgTable("local_thread_locks", {
  threadId: text("thread_id").primaryKey(),
  runId: text("run_id").notNull(),
  userId: text("user_id").notNull().default(""),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});
