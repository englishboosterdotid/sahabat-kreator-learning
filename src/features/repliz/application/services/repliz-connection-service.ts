import { and, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { replizConnection } from "@/db/schema/integration/repliz";
import { team } from "@/db/schema/org/team";

type SaveReplizConnectionInput = {
  teamId: string;
  platform: string;
  replizAccountId: string;
  externalName: string;
  externalUsername?: string | null;
  externalPicture?: string | null;
  isConnected?: boolean;
};

export async function getTeamById(teamId: string) {
  const result = await db
    .select()
    .from(team)
    .where(eq(team.id, teamId))
    .limit(1);

  return result[0] ?? null;
}

export async function saveReplizConnection(
  input: SaveReplizConnectionInput,
) {
  const teamRecord = await getTeamById(input.teamId);

  if (!teamRecord) {
    throw new Error("Team tidak ditemukan");
  }

  const existingResult = await db
    .select()
    .from(replizConnection)
    .where(
      and(
        eq(replizConnection.teamId, input.teamId),
        eq(replizConnection.replizAccountId, input.replizAccountId),
      ),
    )
    .limit(1);

  const existing = existingResult[0] ?? null;

  if (existing) {
    const updatedResult = await db
      .update(replizConnection)
      .set({
        platform: input.platform,
        externalName: input.externalName,
        externalUsername: input.externalUsername ?? null,
        externalPicture: input.externalPicture ?? null,
        isConnected: input.isConnected ?? true,
        updatedAt: new Date(),
      })
      .where(eq(replizConnection.id, existing.id))
      .returning();

    return updatedResult[0] ?? null;
  }

  const createdResult = await db
    .insert(replizConnection)
    .values({
      id: crypto.randomUUID(),
      organizationId: teamRecord.organizationId,
      teamId: input.teamId,
      platform: input.platform,
      replizAccountId: input.replizAccountId,
      externalName: input.externalName,
      externalUsername: input.externalUsername ?? null,
      externalPicture: input.externalPicture ?? null,
      isConnected: input.isConnected ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return createdResult[0] ?? null;
}

export async function listReplizConnectionsByTeam(teamId: string) {
  return db
    .select()
    .from(replizConnection)
    .where(eq(replizConnection.teamId, teamId))
    .orderBy(desc(replizConnection.createdAt));
}

export async function getReplizConnectionById(id: string) {
  const result = await db
    .select()
    .from(replizConnection)
    .where(eq(replizConnection.id, id))
    .limit(1);

  return result[0] ?? null;
}

export async function disconnectLocalReplizConnection(id: string) {
  const result = await db
    .update(replizConnection)
    .set({
      isConnected: false,
      updatedAt: new Date(),
    })
    .where(eq(replizConnection.id, id))
    .returning();

  return result[0] ?? null;
}