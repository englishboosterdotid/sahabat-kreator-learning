import { headers } from "next/headers";
import { eq, and } from "drizzle-orm";

import { auth } from "@/lib/auth/server";
import { db } from "@/db";
import { team, teamMember, user } from "@/db/schema";
import { TeamRole, TEAM_ROLES } from "../../types/roles";

const authApi = (auth as any).api;

export async function listTeams() {
  const data = await authApi.getFullOrganization({
    headers: await headers(),
  });
  return data?.teams || [];
}

// Fungsi baru untuk mengambil teams beserta members secara manual dari DB
export async function listTeamsWithMembers() {
  // Pertama, kita dapatkan teams dari Better Auth
  const fullOrg = await authApi.getFullOrganization({
    headers: await headers(),
  });
  const teamsFromAuth = fullOrg?.teams || [];

  // Untuk setiap team, kita query members dari database Drizzle
  const teamsWithMembers = await Promise.all(
    teamsFromAuth.map(async (t: any) => {
      // Query team members dengan join ke table user
      const members = await db
        .select({
          id: teamMember.id,
          teamId: teamMember.teamId,
          userId: teamMember.userId,
          role: teamMember.role,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          },
        })
        .from(teamMember)
        .innerJoin(user, eq(teamMember.userId, user.id))
        .where(eq(teamMember.teamId, t.id));

      return {
        ...t,
        members,
      };
    })
  );

  return teamsWithMembers;
}

export async function createTeam(
  name: string,
  {
    slug,
    logo,
  }: {
    slug?: string;
    logo?: string;
  } = {}
) {
  return authApi.createTeam({
    headers: await headers(),
    body: {
      name,
      slug,
      logo,
    },
  });
}

export async function updateTeam(
  teamId: string,
  {
    name,
    slug,
    logo,
  }: {
    name?: string;
    slug?: string;
    logo?: string;
  }
) {
  return authApi.updateTeam({
    headers: await headers(),
    body: {
      teamId,
      data: {
        name,
        slug,
        logo,
      },
    },
  });
}

export async function deleteTeam(teamId: string) {
  return authApi.deleteTeam({
    headers: await headers(),
    body: {
      teamId,
    },
  });
}

export async function addTeamMember(
  teamId: string,
  userId: string,
  role: TeamRole = TEAM_ROLES.TEAM_VIEWER // Default ke viewer
) {
  // Gunakan database Drizzle untuk menambah team member
  await db.insert(teamMember).values({
    id: crypto.randomUUID(),
    teamId,
    userId,
    role,
    createdAt: new Date(),
  });
}

export async function removeTeamMember(teamId: string, userId: string) {
  // Gunakan database Drizzle untuk menghapus team member
  await db
    .delete(teamMember)
    .where(and(eq(teamMember.teamId, teamId), eq(teamMember.userId, userId)));
}

// Tambahkan fungsi update role untuk scalability nanti
export async function updateTeamMemberRole(
  teamId: string,
  userId: string,
  role: TeamRole
) {
  // Gunakan database Drizzle untuk mengupdate role team member
  await db
    .update(teamMember)
    .set({ role })
    .where(and(eq(teamMember.teamId, teamId), eq(teamMember.userId, userId)));
}

// New functions for active team
export async function setActiveTeam(teamId: string) {
  return authApi.setActiveTeam({
    headers: await headers(),
    body: {
      teamId,
    },
  });
}

export async function getActiveTeam() {
  const data = await authApi.getFullOrganization({
    headers: await headers(),
  });
  return data?.activeTeam || null;
}

// Team invitation functions - using organization invitation with teamId parameter
export async function listTeamInvitations(teamId: string) {
  // For now, return empty array since team invitations are not natively supported
  return [];
}

export async function inviteTeamMember(
  teamId: string,
  teamName: string,
  email: string,
  role: TeamRole = TEAM_ROLES.TEAM_VIEWER
) {
  // Use organization createInvitation with teamId, teamName, and teamRole
  // Use "member" as the organization role since Better Auth only recognizes org roles
  return (authApi as any).createInvitation({
    headers: await headers(),
    body: { 
      email, 
      role: "member", // Use valid organization role
      // @ts-ignore
      teamId, 
      teamName,
      teamRole: role // Store actual team role separately
    },
  });
}

export async function cancelTeamInvitation(teamId: string, invitationId: string) {
  return (authApi as any).cancelInvitation({
    headers: await headers(),
    body: { invitationId },
  });
}
