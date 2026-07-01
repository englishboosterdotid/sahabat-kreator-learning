import { headers } from "next/headers";

import { auth } from "@/lib/auth/server";
import { generateWorkspaceSlug } from "@/lib/utils/slug";

const authApi = (auth as any).api;

export async function listOrganizations() {
  return authApi.listOrganizations({
    headers: await headers(),
  });
}

export async function getActiveOrganization() {
  return authApi.getFullOrganization({
    headers: await headers(),
  });
}

export async function setActiveOrganization(organizationId: string) {
  return authApi.setActiveOrganization({
    headers: await headers(),
    body: {
      organizationId,
    },
  });
}

export async function createOrganization(name: string) {
  return authApi.createOrganization({
    headers: await headers(),
    body: {
      name,
      slug: generateWorkspaceSlug(name),
      keepCurrentActiveOrganization: false,
    },
  });
}

export async function updateOrganization(organizationId: string, name: string) {
  return authApi.updateOrganization({
    headers: await headers(),
    body: {
      organizationId,
      data: {
        name,
        slug: generateWorkspaceSlug(name),
      },
    },
  });
}

export async function deleteOrganization(organizationId: string) {
  return authApi.deleteOrganization({
    headers: await headers(),
    body: {
      organizationId,
    },
  });
}