import { createFileRoute } from "@tanstack/react-router";
import { TeamApprovalSettings } from "@/components/approvals/team-settings";
import { PageShell } from "@/components/layout/page-shell";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_authed/admin/approvals")({
  component: AdminApprovalsPage,
});

function AdminApprovalsPage() {
  const { t } = useI18n();
  return (
    <PageShell
      description={t(
        "What members' Bots must ask before they act, rules for everyone, and requests to use shared accounts.",
      )}
      title={t("Approvals")}
    >
      <TeamApprovalSettings />
    </PageShell>
  );
}
