import { headers } from "next/headers";

import { auth } from "./server";
import { redirect } from "next/navigation";

export async function getSession() {
  return auth.api.getSession({
    headers: await headers(),
  });
}

export async function requireAuth() {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  return session;
}

export async function requireOrganization() {
  const session = await requireAuth();

  if (!session.session.activeOrganizationId) {
    redirect("/onboarding");
  }

  return session;
}