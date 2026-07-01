import { headers } from "next/headers";

import { auth } from "@/lib/auth/server";

const authApi = (auth as any).api;

export async function listMembers() {
  return authApi.listMembers({
    headers: await headers(),
  });
}

export async function removeMember(memberId: string) {
  return authApi.removeMember({
    headers: await headers(),
    body: {
      memberId,
    },
  });
}

export async function updateMemberRole(memberId: string, role: string) {
  return authApi.updateMemberRole({
    headers: await headers(),
    body: {
      memberId,
      role,
    },
  });
}
