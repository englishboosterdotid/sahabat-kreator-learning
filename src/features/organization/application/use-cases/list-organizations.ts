import { headers } from "next/headers";

import { auth } from "@/lib/auth/server";

export async function listOrganizations() {
  return auth.api.listOrganizations({
    headers: await headers(),
  });
}