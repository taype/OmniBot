import { createFileRoute } from "@tanstack/react-router";
import { CapabilitiesShell } from "@/components/capabilities/capabilities-shell";
import { MemoryList, RememberFact } from "@/components/memory/memories";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_authed/_app/capabilities/memory")({
  component: MemoryPage,
});

function MemoryPage() {
  const { t } = useI18n();
  return (
    <CapabilitiesShell>
      <MemoryList
        action={<RememberFact />}
        description={t(
          "What your Bots know about you. Facts you add reach every Bot. What a Bot learns on its own stays with that Bot.",
        )}
      />
    </CapabilitiesShell>
  );
}
