"use server";

import { revalidatePath } from "next/cache";

import { setActiveOrganization, createOrganization, updateOrganization, deleteOrganization } from "../application/services/organization-service";
import { inviteMember, cancelInvitation } from "../application/services/invitation-service";
import { removeMember, updateMemberRole } from "../application/services/member-service";
import { createOrganizationSchema } from "../validation/create-organization";

export async function switchOrganizationAction(
  organizationId: string
) {
  await setActiveOrganization(organizationId);

  revalidatePath("/dashboard", "layout");
  revalidatePath("/dashboard/members");
  revalidatePath("/dashboard/brands");
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

export async function inviteMemberAction(
  formData: FormData
) {
  const email = formData.get("email") as string;
  const role = formData.get("role") as string || "member";

  try {
    await inviteMember(email, role);
  } catch (error: any) {
    // Check if error is about already invited user
    if (error?.message?.includes("already")) {
      throw new Error("User already invited");
    }
    if (error?.body?.message) {
      throw new Error(error.body.message);
    }
    throw error;
  }

  revalidatePath("/dashboard/members");
}

export async function removeMemberAction(
  memberId: string
) {
  try {
    await removeMember(memberId);
  } catch (error: any) {
    if (error?.body?.message) {
      throw new Error(error.body.message);
    }
    throw error;
  }

  revalidatePath("/dashboard/members");
}

export async function cancelInvitationAction(
  invitationId: string
) {
  try {
    await cancelInvitation(invitationId);
  } catch (error: any) {
    if (error?.body?.message) {
      throw new Error(error.body.message);
    }
    throw error;
  }

  revalidatePath("/dashboard/members");
}

export async function updateMemberRoleAction(
  memberId: string,
  role: string
) {
  try {
    await updateMemberRole(memberId, role);
  } catch (error: any) {
    if (error?.body?.message) {
      throw new Error(error.body.message);
    }
    throw error;
  }

  revalidatePath("/dashboard/members");
}

export async function updateOrganizationAction(
  organizationId: string,
  name: string
) {
  try {
    await updateOrganization(organizationId, name);
  } catch (error: any) {
    if (error?.body?.message) {
      throw new Error(error.body.message);
    }
    throw error;
  }
  revalidatePath("/dashboard", "layout");
  revalidatePath("/dashboard/members");
  revalidatePath("/dashboard/brands");
}

export async function deleteOrganizationAction(
  organizationId: string
) {
  try {
    await deleteOrganization(organizationId);
  } catch (error: any) {
    if (error?.body?.message) {
      throw new Error(error.body.message);
    }
    throw error;
  }
  revalidatePath("/dashboard", "layout");
  revalidatePath("/");
}