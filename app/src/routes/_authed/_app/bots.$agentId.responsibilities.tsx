import { createFileRoute } from "@tanstack/react-router";
import { BotSubpage } from "@/components/bot-profile/bot-subpage";
import { useI18n } from "@/lib/i18n";
import { BotResponsibilities } from "@/components/responsibilities/responsibilities";

export const Route = createFileRoute(
  "/_authed/_app/bots/$agentId/responsibilities",
)({
  component: ResponsibilitiesPage,
});

function ResponsibilitiesPage() {
  const { agentId } = Route.useParams();
  const { t } = useI18n();
  return (
    <BotSubpage
      agentId={agentId}
      description={t(
        "Ongoing goals this Bot works on for you. See what started each run and what it found.",
      )}
      title={t("Responsibilities")}
    >
      {(agent) => <BotResponsibilities agentId={agent.id} />}
    </BotSubpage>
  );
}
