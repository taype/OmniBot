import { EventType, type BaseEvent, type Message } from "@ag-ui/client";
import {
  AgentRunner,
  type AgentRunnerConnectRequest,
  type AgentRunnerIsRunningRequest,
  type AgentRunnerRunRequest,
  type AgentRunnerStopRequest,
} from "@copilotkit/runtime/v2";
import { ReplaySubject, type Observable } from "rxjs";
import type {
  LocalThreadStore,
  StoredThreadMessage,
} from "./local-thread-store";

/**
 * The in-process runner a local deployment runs agents through.
 *
 * This replaces `IntelligenceAgentRunner`, whose only real job was to publish an agent's AG-UI
 * events to the cloud gateway and let the gateway persist them. Here the run happens in this
 * process (`agent.runAgent(input)` is the same call the gateway runner makes internally), the events
 * stream straight back to whoever asked, and the transcript is written to PostgreSQL when the run
 * ends.
 *
 * Modelled on the package's own `InMemoryAgentRunner` (`dist/v2/runtime/runner/in-memory.mjs`),
 * minus the process-memory LRU store: the messages a run leaves behind are persisted instead, and
 * `ɵsupportsLocalThreadEndpoints` lets the runtime's own `/threads/:id/messages` route serve them
 * from the per-thread cache this keeps.
 */

function toAgentMessage(record: StoredThreadMessage): Message {
  return {
    id: record.id,
    role: record.role,
    content: record.content ?? "",
    ...(record.activityType ? { activityType: record.activityType } : {}),
    ...(record.toolCalls
      ? {
          toolCalls: record.toolCalls.map((call) => ({
            id: call.id,
            type: "function" as const,
            function: { name: call.name, arguments: call.args },
          })),
        }
      : {}),
    ...(record.toolCallId ? { toolCallId: record.toolCallId } : {}),
  } as Message;
}

type ActiveRun = { agent: AgentRunnerRunRequest["agent"]; runId: string };

export class LocalAgentRunner extends AgentRunner {
  /** Enables the runtime's own `GET /threads…` family to answer from this runner instead of 422. */
  readonly ɵsupportsLocalThreadEndpoints = true as const;

  private readonly active = new Map<string, ActiveRun>();
  /** The last full transcript seen per thread, so the runtime's sync readers can answer. */
  private readonly transcripts = new Map<string, Message[]>();
  private readonly store: LocalThreadStore;

  constructor(store: LocalThreadStore) {
    super();
    this.store = store;
  }

  /**
   * Load existing conversations into the in-process cache.
   *
   * The runtime's local thread endpoints are synchronous, so a thread the process has not touched
   * yet can only be answered from memory. Called once at boot, bounded to the most recently updated
   * conversations, which is what a browser restoring `/bot` or a channel needs.
   */
  async warm(limit = 500): Promise<number> {
    const threads = await this.store.recentThreads(limit);
    for (const thread of threads) {
      const messages = await this.store.getMessages(thread.id);
      if (messages.length > 0) {
        this.transcripts.set(thread.id, messages.map(toAgentMessage));
      }
    }
    return this.transcripts.size;
  }

  getThreadMessages(threadId: string): Message[] {
    return [...(this.transcripts.get(threadId) ?? [])];
  }

  getThreadEvents(): BaseEvent[] {
    // Events are not retained locally; only the transcript is. An inspector asking for the raw
    // event log gets an empty history rather than a lie.
    return [];
  }

  getThreadState(): Record<string, unknown> | null {
    return null;
  }

  listThreads() {
    return [...this.transcripts.entries()].map(([threadId]) => ({
      id: threadId,
      name: null,
      agentId: "",
      organizationId: "",
      createdById: "",
      archived: false,
      createdAt: new Date(0).toISOString(),
      updatedAt: new Date().toISOString(),
    }));
  }

  clearThreads(): void {
    // Nothing to wipe from memory that the database does not hold; history is durable by design.
  }

  run(request: AgentRunnerRunRequest): Observable<BaseEvent> {
    if (this.active.has(request.threadId)) {
      /*
       * One run per conversation, refused rather than queued — the same rule the cloud lock
       * enforces, and what the browser's stop-then-send gesture relies on. The caller sees a failed
       * run, which is the honest answer for "somebody else is streaming into this thread".
       */
      throw new Error("Thread already running");
    }
    const subject = new ReplaySubject<BaseEvent>(Infinity);
    this.active.set(request.threadId, {
      agent: request.agent,
      runId: request.input.runId,
    });

    const runAgent = async () => {
      try {
        await request.agent.runAgent(request.input, {
          onEvent: ({ event }) => {
            subject.next(event);
          },
        });
      } finally {
        this.active.delete(request.threadId);
        const messages = request.agent.messages ?? [];
        this.transcripts.set(request.threadId, [...messages]);
        try {
          await this.store.appendMessages({
            threadId: request.threadId,
            agentId: request.agent.agentId ?? "",
            messages,
          });
        } catch (error) {
          // A transcript that failed to persist must not fail the run the person is watching:
          // they saw the answer, and the next run re-sends the whole conversation anyway.
          console.error(
            JSON.stringify({
              type: "local-thread-persist-failed",
              threadId: request.threadId,
              reason: error instanceof Error ? error.message : String(error),
            }),
          );
        }
        subject.complete();
      }
    };
    void runAgent().catch((error) => {
      this.active.delete(request.threadId);
      subject.error(error);
    });

    return subject.asObservable();
  }

  connect(request: AgentRunnerConnectRequest): Observable<BaseEvent> {
    /*
     * A late joiner replays the transcript as one snapshot.
     *
     * The cloud replays compacted events; a local deployment keeps only the messages, and a single
     * `MESSAGES_SNAPSHOT` is the compact form of exactly that. The app's channel and `/bot` surfaces
     * both reconstruct the conversation from it, so no event-log fidelity is lost for a viewer.
     */
    const subject = new ReplaySubject<BaseEvent>(Infinity);
    const messages = this.transcripts.get(request.threadId);
    if (messages && messages.length > 0) {
      subject.next({
        type: EventType.MESSAGES_SNAPSHOT,
        messages,
      } as unknown as BaseEvent);
    }
    subject.complete();
    return subject.asObservable();
  }

  isRunning(request: AgentRunnerIsRunningRequest): Promise<boolean> {
    return Promise.resolve(this.active.has(request.threadId));
  }

  async stop(request: AgentRunnerStopRequest): Promise<boolean | undefined> {
    const run = this.active.get(request.threadId);
    if (!run) return false;
    if (request.runId && run.runId !== request.runId) return false;
    try {
      run.agent.abortRun();
    } catch {
      // An agent that cannot be aborted still gets its run closed by the error it raises.
    }
    return true;
  }
}

/** AG-UI's event stream sometimes hands back `runAgent(input)` directly; kept for symmetry. */
export type { Message };
