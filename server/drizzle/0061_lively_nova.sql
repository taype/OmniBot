CREATE TABLE "local_thread_locks" (
	"thread_id" text PRIMARY KEY NOT NULL,
	"run_id" text NOT NULL,
	"user_id" text DEFAULT '' NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "local_thread_messages" (
	"thread_id" text NOT NULL,
	"message_id" text NOT NULL,
	"role" text NOT NULL,
	"content" jsonb,
	"activity_type" text,
	"tool_calls" jsonb,
	"tool_call_id" text,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "local_threads" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text DEFAULT '' NOT NULL,
	"agent_id" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "local_thread_messages_pk" ON "local_thread_messages" USING btree ("thread_id","message_id");--> statement-breakpoint
CREATE INDEX "local_thread_messages_thread_idx" ON "local_thread_messages" USING btree ("thread_id","position");--> statement-breakpoint
CREATE INDEX "local_threads_user_idx" ON "local_threads" USING btree ("user_id");