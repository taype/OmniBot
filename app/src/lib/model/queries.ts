import { queryOptions } from "@tanstack/react-query";
import { client } from "@/lib/client";

export type ModelProvider = "openai" | "anthropic" | "google";
export type ModelApi = "chat" | "responses";

/** What the server says is configured, and what the deployment defaults would be without a save. */
export type ModelStatus = {
  saved: boolean;
  provider: ModelProvider;
  model: string;
  baseUrl: string | null;
  api: ModelApi;
  credentialConfigured: boolean;
  defaults: { provider: ModelProvider; model: string; baseUrl: string | null };
};

export type ModelTestResult = {
  ok: boolean;
  ms: number;
  reply?: string;
  error?: string;
};

export type ModelSaveInput = {
  provider: ModelProvider;
  model: string;
  baseUrl?: string | null;
  api?: ModelApi;
  /** A new key, write-only: the server stores it encrypted and never returns it. */
  apiKey?: string;
};

export const modelKeys = { status: ["admin", "model"] as const };

export function modelStatusQueryOptions() {
  return queryOptions({
    queryKey: modelKeys.status,
    queryFn: (): Promise<ModelStatus> =>
      client("/api/admin/model", "model", {
        fallback: "The model settings could not be loaded.",
      }),
  });
}

export function saveModel(input: ModelSaveInput): Promise<ModelStatus> {
  return client("/api/admin/model", "model", {
    method: "PUT",
    body: input,
    fallback: "The model could not be saved.",
  });
}

/** Forget the saved model: the deployment goes back to `.env` and the tenant package. */
export function clearModel(): Promise<ModelStatus> {
  return client("/api/admin/model", "model", {
    method: "DELETE",
    fallback: "The model could not be reset.",
  });
}

/** One tiny completion against the configured model, to prove the key and endpoint work. */
export function testModel(): Promise<ModelTestResult> {
  return client("/api/admin/model/test", "result", {
    method: "POST",
    fallback: "The model could not be reached.",
  });
}
