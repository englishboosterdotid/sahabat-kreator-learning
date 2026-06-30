import { headers } from "next/headers";

import { auth } from "@/lib/auth/server";

import type { SignInInput } from "../validation/sign-in";

export async function signIn(data: SignInInput) {
  return auth.api.signInEmail({
    body: {
      email: data.email,
      password: data.password,
    },
    headers: await headers(),
  });
}