"use server";

import { revalidatePath } from "next/cache";
import {
  addTeamMember,
  createTeam,
  deleteTeam,
  removeTeamMember,
  updateTeam,
  updateTeamMemberRole,
  setActiveTeam,
  inviteTeamMember,
  cancelTeamInvitation,
} from "../application/services/team-service";
import { createTeamSchema } from "../validation/create-team";
import { TeamRole } from "../types/roles";

export async function createTeamAction(formData: FormData) {
  const values = createTeamSchema.parse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    logo: formData.get("logo") as string,
  });

  try {
    await createTeam(values.name, {
      slug: values.slug,
      logo: values.logo,
    });
  } catch (error: any) {
    if (error?.body?.message) {
      throw new Error(error.body.message);
    }
    throw error;
  }

  revalidatePath("/dashboard/brands");
  revalidatePath("/dashboard");
}

// New update action that takes params directly instead of formData
export async function updateTeamAction(
  teamId: string,
  data: { name?: string; slug?: string; logo?: string }
) {
  try {
    await updateTeam(teamId, data);
  } catch (error: any) {
    if (error?.body?.message) {
      throw new Error(error.body.message);
    }
    throw error;
  }

  revalidatePath("/dashboard/brands");
  revalidatePath("/dashboard");
}

export async function deleteTeamAction(teamId: string) {
  try {
    await deleteTeam(teamId);
  } catch (error: any) {
    if (error?.body?.message) {
      throw new Error(error.body.message);
    }
    throw error;
  }

  revalidatePath("/dashboard/brands");
  revalidatePath("/dashboard");
}

export async function addTeamMemberAction(
  teamId: string,
  userId: string,
  role?: string
) {
  try {
    await addTeamMember(teamId, userId, role as TeamRole);
  } catch (error: any) {
    if (error?.body?.message) {
      throw new Error(error.body.message);
    }
    throw error;
  }

  // Revalidate all relevant paths to clear cache
  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/brands");
  revalidatePath("/dashboard/members");
  revalidatePath("/dashboard/settings");
}

export async function removeTeamMemberAction(teamId: string, userId: string) {
  try {
    await removeTeamMember(teamId, userId);
  } catch (error: any) {
    if (error?.body?.message) {
      throw new Error(error.body.message);
    }
    throw error;
  }

  // Revalidate all relevant paths to clear cache
  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/brands");
  revalidatePath("/dashboard/members");
  revalidatePath("/dashboard/settings");
}

export async function updateTeamMemberRoleAction(
  teamId: string,
  userId: string,
  role: string
) {
  try {
    await updateTeamMemberRole(teamId, userId, role as TeamRole);
  } catch (error: any) {
    if (error?.body?.message) {
      throw new Error(error.body.message);
    }
    throw error;
  }

  // Revalidate all relevant paths to clear cache
  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/brands");
  revalidatePath("/dashboard/members");
  revalidatePath("/dashboard/settings");
}

export async function setActiveTeamAction(teamId: string) {
  try {
    await setActiveTeam(teamId);
  } catch (error: any) {
    if (error?.body?.message) {
      throw new Error(error.body.message);
    }
    throw error;
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/brands");
  revalidatePath("/dashboard/members");
  revalidatePath("/dashboard/settings");
}

// Team invitation actions
export async function inviteTeamMemberAction(
  teamId: string,
  teamName: string,
  email: string,
  role?: string
) {
  try {
    await inviteTeamMember(teamId, teamName, email, role as TeamRole);
  } catch (error: any) {
    if (error?.body?.message) {
      throw new Error(error.body.message);
    }
    throw error;
  }
  revalidatePath("/dashboard/brands");
  revalidatePath("/dashboard");
}

export async function cancelTeamInvitationAction(
  teamId: string,
  invitationId: string
) {
  try {
    await cancelTeamInvitation(teamId, invitationId);
  } catch (error: any) {
    if (error?.body?.message) {
      throw new Error(error.body.message);
    }
    throw error;
  }
  revalidatePath("/dashboard/brands");
  revalidatePath("/dashboard");
}
