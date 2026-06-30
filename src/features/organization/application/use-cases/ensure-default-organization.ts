import { headers } from "next/headers";

import { auth } from "@/lib/auth/server";
import { generateWorkspaceSlug } from "@/lib/utils/slug";
import { listOrganizations } from "../services/organization-service";

type Input = {
  userName: string;
};

export async function ensureDefaultOrganization({
  userName,
}: Input) {
  const requestHeaders = await headers();

  const organizations = await listOrganizations();

  if (organizations.length > 0) {
    return organizations[0];
  }

  return auth.api.createOrganization({
    headers: requestHeaders,
    body: {
      name: `Workspace ${userName}`,
      slug: generateWorkspaceSlug(userName),
      keepCurrentActiveOrganization: false,
    },
  });
}