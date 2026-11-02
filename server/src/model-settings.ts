import { generateText } from "ai";
import { eq } from "drizzle-orm";
import type { ModelRuntimeConfig, ModelProvider } from "./agents/model-api";
import { modelApiFromEnvironment, modelFromSettings } from "./agents/model-api";
import { recordAuditEvent, type AuditStore } from "./audit";
import {
  type CredentialAdminService,
  type ModelCredentialSecretReader,
  resolveModelApiKey,
} from "./credentials";
import type { Database } from "./db/client";
import { modelSettings } from "./db/schema/model-settings";

/**
 * The key id a model saved from the admin page stores its credential under.
 *
 * One id, with the provider distinguishing the rows: the vault is keyed on (kind, provider, keyId),
 * so changing the OpenAI key and changing the Anthropic key are separate rows and neither can
 * overwrite the other. The tenant package's own `credential_secret_ref` is untouched and keeps
 * working when no model has been saved.
 */
export const MODEL_CREDENTIAL_KEY_ID = "default";

export type SavedModel = {
  provider: ModelProvider;
  model: string;
  baseUrl: string | null;
};

/** What `.env` and the tenant package say, which is what a deployment without a saved model uses. */
export type ModelDefaults = {
  provider: ModelProvider;
  model: string;
  baseUrl: string | null;
};

export type ModelAdminStatus = {
  /** Whether the admin page has saved a model; false means the deployment defaults apply. */
  saved: boolean;
  provider: ModelProvider;
  model: string;
  baseUrl: string | null;
  api: "chat" | "responses";
  /** Whether a key is reachable: the vault first, then the provider's environment variable. */
  credentialConfigured: boolean;
  defaults: ModelDefaults;
};

export type ModelSaveInput = {
  provider: ModelProvider;
  model: string;
  baseUrl?: string | null;
  api?: "chat" | "responses";
  /** A new key, write-only. Absent keeps the credential the vault already holds. */
  apiKey?: string;
  actorUserId?: string;
};

export type ModelTestResult = {
  ok: boolean;
  ms: number;
  reply?: string;
  error?: string;
};

export type ModelAdminService = {
  status(): Promise<ModelAdminStatus>;
  save(input: ModelSaveInput): Promise<ModelAdminStatus>;
  clear(actorUserId?: string): Promise<ModelAdminStatus>;
  test(): Promise<ModelTestResult>;
};

const PROVIDERS: readonly ModelProvider[] = ["openai", "anthropic", "google"];

export function isModelProvider(value: unknown): value is ModelProvider {
  return (
    typeof value === "string" &&
    (PROVIDERS as readonly string[]).includes(value)
  );
}

/**
 * The deployment's model, as saved by an administrator, or nothing when it never was.
 *
 * Cached in memory: the agents are built per run and read this on every build, so a saved change
 * must not mean a database round trip before each answer — and a save must reach the next run, not
 * the next restart.
 */
export function createModelSettingsStore(database: Database) {
  let current: SavedModel | undefined;
  return {
    async load(): Promise<SavedModel | undefined> {
      const [row] = await database
        .select()
        .from(modelSettings)
        .where(eq(modelSettings.id, "default"))
        .limit(1);
      current = row
        ? {
            provider: row.provider,
            model: row.model,
            baseUrl: row.baseUrl,
          }
        : undefined;
      return current;
    },
    current(): SavedModel | undefined {
      return current;
    },
    async save(input: SavedModel, updatedBy?: string): Promise<void> {
      await database
        .insert(modelSettings)
        .values({
          id: "default",
          provider: input.provider,
          model: input.model,
          baseUrl: input.baseUrl,
          updatedBy: updatedBy ?? null,
        })
        .onConflictDoUpdate({
          target: modelSettings.id,
          set: {
            provider: input.provider,
            model: input.model,
            baseUrl: input.baseUrl,
            updatedAt: new Date(),
            updatedBy: updatedBy ?? null,
          },
        });
      current = input;
    },
    async clear(): Promise<void> {
      await database
        .delete(modelSettings)
        .where(eq(modelSettings.id, "default"));
      current = undefined;
    },
  };
}

export type ModelSettingsStore = ReturnType<typeof createModelSettingsStore>;

/** Refuse what the form should never have produced, with a sentence naming the field. */
function validate(input: ModelSaveInput): string | null {
  if (!isModelProvider(input.provider)) {
    return "Pick a provider: openai, anthropic or google.";
  }
  if (typeof input.model !== "string" || input.model.trim().length === 0) {
    return "The model name is required, as the provider publishes it.";
  }
  if (input.model.length > 200) return "The model name is too long.";
  if (
    input.baseUrl !== undefined &&
    input.baseUrl !== null &&
    input.baseUrl.trim() !== ""
  ) {
    let url: URL;
    try {
      url = new URL(input.baseUrl);
    } catch {
      return "The base URL is not a URL.";
    }
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return "The base URL must be http or https.";
    }
  }
  if (
    input.api !== undefined &&
    input.api !== "chat" &&
    input.api !== "responses"
  ) {
    return 'The API must be "chat" or "responses".';
  }
  if (input.apiKey !== undefined && typeof input.apiKey !== "string") {
    return "The API key must be a string.";
  }
  return null;
}

/**
 * The admin page's model service: read what is configured, save a new choice, clear it back to the
 * deployment defaults, and try the current one against the provider.
 *
 * The key is never returned. `status()` says whether one is configured; `test()` says whether it
 * works; nothing puts plaintext anywhere an API response can reach.
 */
export function createModelAdminService(deps: {
  store: ModelSettingsStore;
  defaults: ModelDefaults;
  credentialService?: CredentialAdminService;
  credentialReader: ModelCredentialSecretReader;
  encryptionKey: string;
  /**
   * The tenant package's credential ref, used when no model has been saved — the same one the
   * server has always resolved through `model.credential_secret_ref`.
   */
  defaultsKeyId?: string;
  environment?: Record<string, string | undefined>;
  audit?: AuditStore;
  /** Called after a save or a clear, so the running server picks the change up without a restart. */
  onChanged: (config: ModelRuntimeConfig | undefined) => void;
}): ModelAdminService {
  const environment = deps.environment ?? process.env;

  const api = (): "chat" | "responses" => modelApiFromEnvironment(environment);
  const effective = (): {
    provider: ModelProvider;
    model: string;
    baseUrl: string | null;
    saved: boolean;
  } => {
    const saved = deps.store.current();
    return saved
      ? { ...saved, saved: true }
      : { ...deps.defaults, saved: false };
  };

  /** The saved model as the running server should see it, or nothing for "use the defaults". */
  const runtimeConfig = (saved: boolean): ModelRuntimeConfig | undefined => {
    if (!saved) return undefined;
    const { provider, model, baseUrl } = effective();
    return {
      provider,
      model,
      ...(baseUrl ? { baseUrl } : {}),
      api: api(),
    };
  };

  const resolveKey = async (provider: ModelProvider, keyId: string) => {
    try {
      return await resolveModelApiKey({
        encryptionKey: deps.encryptionKey,
        reader: deps.credentialReader,
        provider,
        keyId,
        environment,
      });
    } catch {
      return null;
    }
  };

  async function status(): Promise<ModelAdminStatus> {
    const { provider, model, baseUrl, saved } = effective();
    const key = saved
      ? await resolveKey(provider, MODEL_CREDENTIAL_KEY_ID)
      : await resolveKey(
          provider,
          deps.defaultsKeyId ?? MODEL_CREDENTIAL_KEY_ID,
        );
    return {
      saved,
      provider,
      model,
      baseUrl,
      api: api(),
      credentialConfigured: key !== null,
      defaults: deps.defaults,
    };
  }

  return {
    status,

    async save(input): Promise<ModelAdminStatus> {
      const problem = validate(input);
      if (problem) throw new ModelSettingsRefused(problem);

      if (input.apiKey?.trim() && deps.credentialService) {
        await deps.credentialService.create({
          kind: "model",
          provider: input.provider,
          keyId: MODEL_CREDENTIAL_KEY_ID,
          metadata: { source: "admin-model-page" },
          plaintext: input.apiKey.trim(),
          ...(input.actorUserId ? { actorUserId: input.actorUserId } : {}),
        });
      }
      await deps.store.save(
        {
          provider: input.provider,
          model: input.model.trim(),
          baseUrl: input.baseUrl?.trim() ? input.baseUrl.trim() : null,
        },
        input.actorUserId,
      );
      deps.onChanged(runtimeConfig(true));
      if (deps.audit) {
        await recordAuditEvent(deps.audit, {
          eventType: "model.saved",
          targetType: "deployment",
          targetId: "model",
          ...(input.actorUserId ? { actorUserId: input.actorUserId } : {}),
          payload: {
            provider: input.provider,
            model: input.model.trim(),
            baseUrl: input.baseUrl?.trim() ? input.baseUrl.trim() : null,
          },
        });
      }
      return status();
    },

    async clear(actorUserId): Promise<ModelAdminStatus> {
      await deps.store.clear();
      deps.onChanged(undefined);
      if (deps.audit) {
        await recordAuditEvent(deps.audit, {
          eventType: "model.cleared",
          targetType: "deployment",
          targetId: "model",
          ...(actorUserId ? { actorUserId } : {}),
          payload: {},
        });
      }
      return status();
    },

    async test(): Promise<ModelTestResult> {
      const started = Date.now();
      const { provider, model, baseUrl, saved } = effective();
      const key = await resolveKey(
        provider,
        saved
          ? MODEL_CREDENTIAL_KEY_ID
          : (deps.defaultsKeyId ?? MODEL_CREDENTIAL_KEY_ID),
      );
      if (!key) {
        return {
          ok: false,
          ms: Date.now() - started,
          error: "No API key is configured for this provider.",
        };
      }
      try {
        const result = await generateText({
          model: modelFromSettings({
            provider,
            model,
            apiKey: key,
            baseUrl,
            api: api(),
            environment,
          }),
          prompt: "Reply with exactly: OK",
          maxOutputTokens: 16,
          abortSignal: AbortSignal.timeout(20_000),
        });
        return {
          ok: true,
          ms: Date.now() - started,
          reply: result.text.trim().slice(0, 120),
        };
      } catch (error) {
        return {
          ok: false,
          ms: Date.now() - started,
          error:
            error instanceof Error
              ? error.message.slice(0, 300)
              : String(error),
        };
      }
    },
  };
}

/** A save the form should have prevented; the route answers 400 with this sentence. */
export class ModelSettingsRefused extends Error {}
