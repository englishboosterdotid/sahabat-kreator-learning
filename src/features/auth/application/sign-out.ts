import { headers } from "next/headers";

import { auth } from "@/lib/auth/server";

export async function signOut() {
  return auth.api.signOut({
    headers: await headers(),
  });
}