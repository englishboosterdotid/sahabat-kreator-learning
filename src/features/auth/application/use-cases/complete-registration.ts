import { createDefaultOrganization } from "@/features/organization/application/use-cases/create-default-organization";

import { signUp } from "./sign-up";

import type { SignUpInput } from "../../validation/sign-up";

export async function completeRegistration(
  data: SignUpInput
) {
  const result = await signUp(data);

  

  return result;
}