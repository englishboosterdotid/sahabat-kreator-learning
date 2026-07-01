import { OrganizationSwitcherServer } from "@/features/organization/presentation/components/organization-switcher.server";
import { TeamSwitcherServer } from "@/features/team/presentation/components/team-switcher-server";

export function SidebarHeader() {
  return (
    <div className="border-b border-zinc-200 p-4 dark:border-zinc-800 space-y-3">
      <OrganizationSwitcherServer />
      <TeamSwitcherServer />
    </div>
  );
}