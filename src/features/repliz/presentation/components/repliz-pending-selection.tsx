import { cookies } from "next/headers";
import { listSelectableResources } from "@/lib/integrations/repliz/client";
import {
  cancelReplizPendingSelection,
  finalizeReplizPendingSelection,
} from "@/features/repliz/presentation/actions";
import { replizPendingCookieSchema } from "@/features/repliz/validation/repliz";
import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui";

const platformLabelMap = {
  facebook: "Facebook Page",
  youtube: "YouTube Channel",
  linkedin: "LinkedIn Organization",
};

export async function ReplizPendingSelection() {
  const cookieStore = await cookies();
  const pendingRaw = cookieStore.get("repliz_pending_connect")?.value;

  if (!pendingRaw) {
    return null;
  }

  let pending;

  try {
    pending = replizPendingCookieSchema.parse(JSON.parse(pendingRaw));
  } catch {
    return null;
  }

  const result = await listSelectableResources(pending.platform, pending.token);

  return (
    <section className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 transition-all duration-200 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <div className="space-y-1">
        <CardTitle>Pilih {platformLabelMap[pending.platform]}</CardTitle>
        <CardDescription>
          Langkah ini diperlukan untuk {pending.platform} karena akun yang
          tersedia harus dipilih dulu.
        </CardDescription>
      </div>

      <div className="grid gap-3">
        {result.docs.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-4 rounded-xl border border-zinc-200 p-3 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50"
          >
            <div className="flex min-w-0 flex-col gap-0.5">
              <div className="break-words font-medium text-zinc-900 dark:text-zinc-50">
                {item.name}
              </div>
              <div className="break-all text-sm text-zinc-500 dark:text-zinc-400">
                {item.username ? `@${item.username}` : item.id}
              </div>
            </div>

            <form action={finalizeReplizPendingSelection}>
              <input type="hidden" name="resourceId" value={item.id} />
              <input
                type="hidden"
                name="resourceToken"
                value={item.token ?? ""}
              />
              <Button type="submit" size="sm" className="self-start">
                Hubungkan
              </Button>
            </form>
          </div>
        ))}
      </div>

      <form action={cancelReplizPendingSelection}>
        <Button
          variant="ghost"
          size="sm"
          type="submit"
          className="text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
        >
          Batal
        </Button>
      </form>
    </section>
  );
}
