import { listOrganizations } from "../../application/services/organization-service";

import { getSession } from "@/lib/auth";

import { OrganizationSwitcher } from "./organization-switcher";

export async function OrganizationSwitcherServer() {
  const session = await getSession();

  const organizations = await listOrganizations();

  return (
    <OrganizationSwitcher
      organizations={organizations}
      activeOrganizationId={
        session?.session.activeOrganizationId ?? null
      }
    />
  );
}