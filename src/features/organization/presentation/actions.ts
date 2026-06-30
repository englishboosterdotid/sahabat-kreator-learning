"use server";

import { revalidatePath } from "next/cache";

import { setActiveOrganization, createOrganization } from "../application/services/organization-service";
import { createOrganizationSchema } from "../validation/create-organization";

export async function switchOrganizationAction(
  organizationId: string
) {
  await setActiveOrganization(organizationId);

  revalidatePath("/dashboard");
}

export async function createOrganizationAction(
  formData: FormData
) {
  const values = createOrganizationSchema.parse({
    name: formData.get("name"),
  });

  const organization = await createOrganization(values.name);

  await switchOrganizationAction(organization.id);
}