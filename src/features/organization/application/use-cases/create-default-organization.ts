import { headers } from "next/headers";

import { auth } from "@/lib/auth/server";
import { generateWorkspaceSlug } from "@/lib/utils/slug";

type Input = {
  name: string;
};

export async function createDefaultOrganization({
  name,
}: Input) {
  return auth.api.createOrganization({
    body: {
      name: `Workspace ${name}`,
      slug: generateWorkspaceSlug(name),
      keepCurrentActiveOrganization: false,
    },
    headers: await headers(),
  });
}