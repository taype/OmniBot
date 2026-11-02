import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useId, useState } from "react";
import { PageSection, PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n";
import {
  clearModel,
  type ModelApi,
  type ModelProvider,
  modelKeys,
  modelStatusQueryOptions,
  saveModel,
  testModel,
} from "@/lib/model/queries";

export const Route = createFileRoute("/_authed/admin/model")({
  component: ModelPage,
});

const selectClass = "w-full rounded-md border bg-background px-3 py-2 text-sm";

const PROVIDERS: { value: ModelProvider; label: string }[] = [
  { value: "openai", label: "OpenAI (or any OpenAI-compatible gateway)" },
  { value: "anthropic", label: "Anthropic" },
  { value: "google", label: "Google (Gemini)" },
];

const APIS: { value: ModelApi; label: string }[] = [
  { value: "chat", label: "/v1/chat/completions (most gateways)" },
  { value: "responses", label: "Responses API (OpenAI's own)" },
];

/**
 * The deployment's model, in one place.
 *
 * Deployment-level rather than per-person on purpose: which model the Bots answer on is a cost,
 * privacy and capability decision that belongs to whoever runs this deployment, not to whoever is
 * typing. The form saves to the database and the server reads it on the next run — no restart.
 */
function ModelPage() {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const status = useQuery(modelStatusQueryOptions());
  const current = status.data;

  const [editing, setEditing] = useState(false);
  const [provider, setProvider] = useState<ModelProvider>("openai");
  const [model, setModel] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [api, setApi] = useState<ModelApi>("chat");
  const [apiKey, setApiKey] = useState("");
  const fieldId = useId();

  // Seed the form from what is configured when it arrives, and again after a save or a reset. An
  // in-progress edit is never overwritten: `editing` stays true once the person has typed.
  useEffect(() => {
    if (!current || editing) return;
    setProvider(current.provider);
    setModel(current.model);
    setBaseUrl(current.baseUrl ?? "");
    setApi(current.api);
    setEditing(true);
  }, [current, editing]);

  const save = useMutation({
    mutationFn: saveModel,
    onSuccess: (next) => {
      queryClient.setQueryData(modelKeys.status, next);
      setApiKey("");
    },
  });
  const reset = useMutation({
    mutationFn: clearModel,
    onSuccess: (next) => {
      queryClient.setQueryData(modelKeys.status, next);
      setEditing(false);
    },
  });
  const test = useMutation({ mutationFn: testModel });

  return (
    <PageShell
      title={t("Model")}
      description={t(
        "Which model the Bots answer on. Saved here, it takes effect on the next answer — no restart — and it wins over .env and the tenant package.",
      )}
    >
      <PageSection
        title={t("What is configured now")}
        description={
          current
            ? current.saved
              ? t(
                  "An administrator saved this model. Reset it to fall back to the deployment defaults.",
                )
              : t("Nothing has been saved, so the deployment defaults apply.")
            : undefined
        }
      >
        {status.isPending && <p role="status">{t("Loading…")}</p>}
        {status.error && (
          <p role="alert" className="text-destructive">
            {status.error.message}
          </p>
        )}
        {current && (
          <div className="grid gap-3 text-sm">
            <dl className="grid grid-cols-2 gap-4 rounded-lg border p-4">
              <div>
                <dt className="text-muted-foreground">{t("Provider")}</dt>
                <dd className="font-medium">{current.provider}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">{t("Model")}</dt>
                <dd className="font-mono font-medium">{current.model}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">{t("Base URL")}</dt>
                <dd className="font-mono">
                  {current.baseUrl ?? t("the provider's own endpoint")}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">{t("Wire protocol")}</dt>
                <dd className="font-mono">
                  {current.api === "chat"
                    ? "/v1/chat/completions"
                    : t("Responses API")}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">{t("API key")}</dt>
                <dd
                  className={
                    current.credentialConfigured ? "" : "text-destructive"
                  }
                >
                  {current.credentialConfigured
                    ? t("configured")
                    : t("not configured")}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">
                  {t("Deployment default")}
                </dt>
                <dd className="font-mono">
                  {current.defaults.provider}/{current.defaults.model}
                </dd>
              </div>
            </dl>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={test.isPending}
                onClick={() => test.mutate()}
              >
                {test.isPending ? t("Testing…") : t("Test connection")}
              </Button>
              {test.data?.ok && (
                <span role="status" className="text-sm">
                  {t("Reached in {ms}ms", { ms: test.data.ms })}
                  {test.data.reply
                    ? t("replied “{reply}”", { reply: test.data.reply })
                    : ""}
                </span>
              )}
              {test.data && !test.data.ok && (
                <span role="alert" className="text-destructive text-sm">
                  {test.data.error ?? t("The model did not answer.")}
                </span>
              )}
            </div>
          </div>
        )}
      </PageSection>

      <PageSection
        title={t("Change it")}
        description={t(
          "The API key is write-only: it is stored encrypted and never shown again. Leave it empty to keep the current one.",
        )}
      >
        <div className="grid gap-4">
          <label className="grid gap-2 text-sm" htmlFor={`${fieldId}-provider`}>
            {t("Provider")}
            <select
              id={`${fieldId}-provider`}
              className={selectClass}
              value={provider}
              onChange={(event) =>
                setProvider(event.target.value as ModelProvider)
              }
            >
              {PROVIDERS.map((option) => (
                <option key={option.value} value={option.value}>
                  {t(option.label)}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm" htmlFor={`${fieldId}-model`}>
            {t("Model")}
            <Input
              id={`${fieldId}-model`}
              value={model}
              maxLength={200}
              placeholder="gpt-5.6-terra, claude-sonnet-4-5, gemini-2.5-flash…"
              onChange={(event) => setModel(event.target.value)}
            />
          </label>
          <label className="grid gap-2 text-sm" htmlFor={`${fieldId}-base`}>
            {t("Base URL (optional)")}
            <Input
              id={`${fieldId}-base`}
              value={baseUrl}
              placeholder={t("Leave empty for the provider's own endpoint")}
              onChange={(event) => setBaseUrl(event.target.value)}
            />
          </label>
          <label className="grid gap-2 text-sm" htmlFor={`${fieldId}-api`}>
            {t("Wire protocol")}
            <select
              id={`${fieldId}-api`}
              className={selectClass}
              value={api}
              onChange={(event) => setApi(event.target.value as ModelApi)}
            >
              {APIS.map((option) => (
                <option key={option.value} value={option.value}>
                  {t(option.label)}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm" htmlFor={`${fieldId}-key`}>
            {t("API key (optional)")}
            <Input
              id={`${fieldId}-key`}
              type="password"
              autoComplete="off"
              value={apiKey}
              placeholder={
                current?.credentialConfigured
                  ? t("Leave empty to keep the current key")
                  : t("Paste the key this provider needs")
              }
              onChange={(event) => setApiKey(event.target.value)}
            />
          </label>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              disabled={save.isPending || model.trim().length === 0}
              onClick={() =>
                save.mutate({
                  provider,
                  model: model.trim(),
                  baseUrl: baseUrl.trim() ? baseUrl.trim() : null,
                  api,
                  ...(apiKey.trim() ? { apiKey: apiKey.trim() } : {}),
                })
              }
            >
              {save.isPending ? t("Saving…") : t("Save model")}
            </Button>
            {current?.saved && (
              <Button
                type="button"
                variant="outline"
                disabled={reset.isPending}
                onClick={() => reset.mutate()}
              >
                {reset.isPending
                  ? t("Saving…")
                  : t("Reset to deployment defaults")}
              </Button>
            )}
            {save.isSuccess && (
              <span role="status" className="text-sm">
                {t("Saved. The next answer uses it.")}
              </span>
            )}
            {(save.error || reset.error) && (
              <span role="alert" className="text-destructive text-sm">
                {save.error?.message ?? reset.error?.message}
              </span>
            )}
          </div>
        </div>
      </PageSection>
    </PageShell>
  );
}
