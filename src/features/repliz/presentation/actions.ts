"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { replizPendingCookieSchema } from "@/features/repliz/validation/repliz";
import {
  connectTwoStepPlatform,
  getReplizAccountById,
  removeReplizAccount,
} from "@/lib/integrations/repliz/client";
import {
  disconnectLocalReplizConnection,
  getReplizConnectionById,
  saveReplizConnection,
} from "@/features/repliz/application/services/repliz-connection-service";

export async function finalizeReplizPendingSelection(formData: FormData) {
  const resourceId = formData.get("resourceId");
  const resourceToken = formData.get("resourceToken");

  if (typeof resourceId !== "string" || !resourceId) {
    throw new Error("resourceId tidak valid");
  }

  const cookieStore = await cookies();
  const pendingRaw = cookieStore.get("repliz_pending_connect")?.value;

  if (!pendingRaw) {
    throw new Error("Tidak ada proses Repliz yang sedang menunggu pilihan");
  }

  const pending = replizPendingCookieSchema.parse(JSON.parse(pendingRaw));

  const connectResult = await connectTwoStepPlatform(
    pending.platform,
    resourceId,
    pending.token,
    typeof resourceToken === "string" && resourceToken ? resourceToken : undefined,
  );

  const account = await getReplizAccountById(connectResult.accountId);

  await saveReplizConnection({
    teamId: pending.teamId,
    platform: pending.platform,
    replizAccountId: account.id ?? account._id ?? connectResult.accountId,
    externalName: account.name,
    externalUsername: account.username ?? null,
    externalPicture: account.picture ?? null,
    isConnected: account.isConnected ?? true,
  });

  cookieStore.delete("repliz_pending_connect");

  revalidatePath("/accounts");
  redirect(`/accounts?replizConnected=1&platform=${pending.platform}`);
}

export async function cancelReplizPendingSelection() {
  const cookieStore = await cookies();
  cookieStore.delete("repliz_pending_connect");

  revalidatePath("/accounts");
  redirect("/accounts");
}

export async function disconnectReplizConnection(formData: FormData) {
  const id = formData.get("id");

  if (typeof id !== "string" || !id) {
    throw new Error("ID koneksi tidak valid");
  }

  const connection = await getReplizConnectionById(id);

  if (!connection) {
    throw new Error("Koneksi tidak ditemukan");
  }

  await removeReplizAccount(connection.replizAccountId);
  await disconnectLocalReplizConnection(connection.id);

  revalidatePath("/accounts");
  redirect("/accounts?replizDisconnected=1");
}