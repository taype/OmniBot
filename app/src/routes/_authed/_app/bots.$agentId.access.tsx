import { createFileRoute } from "@tanstack/react-router";
import { AccessSections } from "@/components/bot-profile/access";
import { useI18n } from "@/lib/i18n";
import { BotSubpage } from "@/components/bot-profile/bot-subpage";

export const Route = createFileRoute("/_authed/_app/bots/$agentId/access")({
  component: AccessPage,
});

function AccessPage() {
  const { agentId } = Route.useParams();
  const { t } = useI18n();
  return (
    <BotSubpage
      agentId={agentId}
      description={t("The skills, apps and other Bots this Bot can use.")}
      title={t("Skills and access")}
    >
      {(agent) => <AccessSections agent={agent} />}
    </BotSubpage>
  );
}
