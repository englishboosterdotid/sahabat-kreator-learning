import { OrganizationSwitcherServer } from "@/features/organization/presentation/components/organization-switcher.server";

export function SidebarHeader() {
  return (
    <div className="border-b border-zinc-200 p-4 dark:border-zinc-800">
      <OrganizationSwitcherServer />
    </div>
  );
}