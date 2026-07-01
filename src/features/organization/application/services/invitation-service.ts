import { headers } from "next/headers";

import { auth } from "@/lib/auth/server";

const authApi = (auth as any).api;

export async function listInvitations() {
  return authApi.listInvitations({
    headers: await headers(),
  });
}

export async function inviteMember(email: string, role: string = "member") {
  return authApi.createInvitation({
    headers: await headers(),
    body: {
      email,
      role,
    },
  });
}

export async function cancelInvitation(invitationId: string) {
  return authApi.cancelInvitation({
    headers: await headers(),
    body: {
      invitationId,
    },
  });
}
