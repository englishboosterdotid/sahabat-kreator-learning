"use server";

import { redirect } from "next/navigation";

import { signIn } from "../application/sign-in";
import { completeRegistration } from "../application/use-cases/complete-registration";
import { signOut } from "../application/sign-out";

import { signInSchema } from "../validation/sign-in";
import { signUpSchema } from "../validation/sign-up";

export async function signUpAction(formData: FormData) {
  const values = signUpSchema.parse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  await completeRegistration(values);

  redirect("/dashboard");
}

export async function signInAction(formData: FormData) {
  const values = signInSchema.parse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  await signIn(values);

  redirect("/dashboard");
}

export async function signOutAction() {
  await signOut();

  redirect("/sign-in");
}