import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

/**
 * The model this deployment answers on, saved by an administrator.
 *
 * One row (`id = 'default'`) or none. Absent, the model is whatever `model.yaml`/the environment
 * says, which is how a deployment has always been configured; present, this row wins and the admin
 * page is where it changes. Kept in the database rather than `.env` because the server is already
 * running: a saved change must reach the next run, not the next restart.
 *
 * The API key is NOT here. It goes in the credential vault (`kind: 'model'`, keyId
 * `MODEL_CREDENTIAL_KEY_ID`), encrypted at rest and write-only, exactly like every other secret.
 */
export const modelSettings = pgTable("model_settings", {
  id: text("id").primaryKey(),
  provider: text("provider")
    .$type<"openai" | "anthropic" | "google">()
    .notNull(),
  model: text("model").notNull(),
  /** Empty means the provider's own endpoint. */
  baseUrl: text("base_url"),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedBy: text("updated_by"),
});
