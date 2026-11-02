import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";

export type ModelProvider = "openai" | "anthropic" | "google";

/**
 * Which OpenAI wire protocol the built-in Bots speak.
 *
 * `@ai-sdk/openai` 3.x makes `openai(model)` the RESPONSES API — the modern OpenAI shape, with
 * `input`, `max_output_tokens` and `item_…` part ids. That is the right default against OpenAI
 * itself, and the wrong answer against most OpenAI-compatible gateways (DeepSeek, most Chinese
 * providers, self-hosted vLLM and proxy fronts), which implement `/v1/chat/completions` only. A
 * deployment pointed at one of those with `OPENAI_BASE_URL` used to fail on its first message with
 * `text part item_… not found`, a message that names neither the gateway nor the protocol.
 *
 * `OPENBOT_MODEL_API=chat` selects `/v1/chat/completions` for the built-in Bots instead;
 * `OPENBOT_MODEL_API=responses` is the default and leaves today's behaviour alone. Only the OpenAI
 * provider is affected: Anthropic and Google gateways keep their own protocols.
 */
export type ModelApi = "chat" | "responses";

export function modelApiFromEnvironment(
  environment: Record<string, string | undefined> = process.env,
): ModelApi {
  const value = environment.OPENBOT_MODEL_API?.trim().toLowerCase();
  if (value === "chat" || value === "responses") return value;
  if (value) {
    throw new Error(
      `OPENBOT_MODEL_API must be "chat" or "responses", not "${value}".`,
    );
  }
  return "responses";
}

/**
 * What the admin Model page saved, made readable by the agent-building code without threading it
 * through every signature.
 *
 * One holder because exactly one deployment-level model exists, and because the value has to change
 * between runs rather than at boot: a save on the admin page replaces it here, and the next run the
 * runtime builds reads the new one. `PlanModel` (a desktop signing choice) still wins over this.
 */
export type ModelRuntimeConfig = {
  provider: ModelProvider;
  model: string;
  /** Empty means the provider's own endpoint. */
  baseUrl?: string;
  api: ModelApi;
};

let currentConfig: ModelRuntimeConfig | undefined;

export function setModelRuntimeConfig(
  config: ModelRuntimeConfig | undefined,
): void {
  currentConfig = config;
}

export function getModelRuntimeConfig(): ModelRuntimeConfig | undefined {
  return currentConfig;
}

/** The key variable each provider reads when the vault has no credential. */
const ENV_KEY_NAMES: Record<ModelProvider, string> = {
  openai: "OPENAI_API_KEY",
  anthropic: "ANTHROPIC_API_KEY",
  google: "GOOGLE_API_KEY",
};

/**
 * The base-URL variable each provider reads, for a saved model that names none.
 *
 * OpenAI's is the one OPENBOT documented; the other two are the runtime's own names, read by the
 * AI SDK integration rather than by OpenBot (`normalizeModelBaseUrls` in copilot.ts already
 * normalises them for the runtime's string path).
 */
const ENV_BASE_URL_NAMES: Record<ModelProvider, string> = {
  openai: "OPENAI_BASE_URL",
  anthropic: "ANTHROPIC_BASE_URL",
  google: "GOOGLE_GENERATIVE_AI_BASE_URL",
};

/**
 * A chat-completions language model, for the runtime to use instead of its Responses default.
 *
 * The runtime's model resolver takes a model OBJECT as-is (`if (typeof spec !== "string") return
 * spec`, `@copilotkit/runtime/dist/agent/index.mjs`), which is how `PlanModel` already rides
 * through. This returns exactly that: `openai.chat(model)` with the deployment's base URL and key.
 */
export function chatCompletionsModel(input: {
  model: string;
  apiKey?: string | null;
  environment?: Record<string, string | undefined>;
}) {
  const environment = input.environment ?? process.env;
  const provider = createOpenAI({
    apiKey: input.apiKey || environment.OPENAI_API_KEY,
    baseURL: environment.OPENAI_BASE_URL,
  });
  return provider.chat(input.model);
}

/**
 * The language model for a model chosen on the admin page (or for a connectivity test).
 *
 * Built as an OBJECT for every provider, for the same reason `chatCompletionsModel` is: an object
 * bypasses the runtime's own name-based resolution, so a saved base URL (a gateway, a proxy) is
 * honoured and the OpenAI protocol choice is ours to make.
 */
export function modelFromSettings(input: {
  provider: ModelProvider;
  model: string;
  apiKey?: string | null;
  baseUrl?: string | null;
  api?: ModelApi;
  environment?: Record<string, string | undefined>;
}) {
  const environment = input.environment ?? process.env;
  const apiKey = input.apiKey || environment[ENV_KEY_NAMES[input.provider]];
  const baseURL =
    input.baseUrl?.trim() ||
    environment[ENV_BASE_URL_NAMES[input.provider]]?.trim() ||
    undefined;
  if (input.provider === "anthropic") {
    return createAnthropic({ apiKey, ...(baseURL ? { baseURL } : {}) })(
      input.model,
    );
  }
  if (input.provider === "google") {
    return createGoogleGenerativeAI({
      apiKey,
      ...(baseURL ? { baseURL } : {}),
    })(input.model);
  }
  const openai = createOpenAI({ apiKey, ...(baseURL ? { baseURL } : {}) });
  const api = input.api ?? modelApiFromEnvironment(environment);
  return api === "chat"
    ? openai.chat(input.model)
    : openai.responses(input.model);
}
