import { auth } from "@/lib/auth/server";

import type { SignInInput } from "../validation/sign-in";
import type { SignUpInput } from "../validation/sign-up";

export async function signIn(data: SignInInput) {
  return auth.api.signInEmail({
    body: data,
  });
}

export async function signUp(data: SignUpInput) {
  return auth.api.signUpEmail({
    body: data,
  });
}

export async function signOut() {
  return auth.api.signOut();
}