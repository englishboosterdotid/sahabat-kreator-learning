import { headers } from "next/headers";

import { auth } from "@/lib/auth/server";

import type { SignUpInput } from "../validation/sign-up";

export async function signUp(data: SignUpInput) {
  return auth.api.signUpEmail({
    body: {
      name: data.name,
      email: data.email,
      password: data.password,
    },
    headers: await headers(),
  });
}