import { createFileRoute } from "@tanstack/react-router";
import { BotSubpage } from "@/components/bot-profile/bot-subpage";
import { useI18n } from "@/lib/i18n";
import { SharingSections } from "@/components/bot-profile/sharing";

export const Route = createFileRoute("/_authed/_app/bots/$agentId/sharing")({
  component: SharingPage,
});

function SharingPage() {
  const { agentId } = Route.useParams();
  const { t } = useI18n();
  return (
    <BotSubpage
      agentId={agentId}
      description={t(
        "Who else can use this Bot. Each person's conversations with it are private.",
      )}
      title={t("Sharing")}
    >
      {(agent) => <SharingSections agent={agent} />}
    </BotSubpage>
  );
}
