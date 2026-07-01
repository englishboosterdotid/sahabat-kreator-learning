import { getActiveOrganization } from "@/features/organization/application/services/organization-service";
import { OrganizationSettingsClient } from "../dashboard/organization-settings-client";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const organization = await getActiveOrganization();

  if (!organization) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-zinc-500 dark:text-zinc-400 text-lg">
          No active organization found.
        </p>
        <p className="text-zinc-400 dark:text-zinc-500 text-sm mt-2">
          Please create or join an organization to access settings.
        </p>
      </div>
    );
  }

  return (
    <OrganizationSettingsClient initialOrganization={organization} />
  );
}
