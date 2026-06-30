import { headers } from "next/headers";

import { auth } from "@/lib/auth/server";
import { generateWorkspaceSlug } from "@/lib/utils/slug";

export async function listOrganizations() {
  return auth.api.listOrganizations({
    headers: await headers(),
  });
}

export async function getActiveOrganization() {
  return auth.api.getFullOrganization({
    headers: await headers(),
  });
}

export async function setActiveOrganization(organizationId: string) {
  return auth.api.setActiveOrganization({
    headers: await headers(),
    body: {
      organizationId,
    },
  });
}

export async function createOrganization(name: string) {
  return auth.api.createOrganization({
    headers: await headers(),
    body: {
      name,
      slug: generateWorkspaceSlug(name),
      keepCurrentActiveOrganization: false,
    },
  });
}