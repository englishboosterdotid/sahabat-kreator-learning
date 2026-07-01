import { auth } from "@/lib/auth/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { ReplizConnectButtons } from "@/features/repliz/presentation/components/repliz-connect-buttons";
import { ReplizLocalConnectionList } from "@/features/repliz/presentation/components/repliz-local-connection-list";
import { ReplizPendingSelection } from "@/features/repliz/presentation/components/repliz-pending-selection";
import { listReplizConnectionsByTeam } from "@/features/repliz/application/services/repliz-connection-service";

export default async function AccountsPage() {
  const fullOrg = await (auth as any).api.getFullOrganization({
    headers: await headers(),
  });

  const activeTeam = fullOrg?.activeTeam ?? fullOrg?.teams?.[0] ?? null;

  if (!activeTeam?.id) {
    redirect("/onboarding");
  }

  const connections = await listReplizConnectionsByTeam(activeTeam.id);
  const accountCount = connections.length;

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Integrasi Sosial
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Hubungkan akun media sosial ke workspace aktif agar dapat membuat dan menjadwalkan konten.
        </p>
      </div>

      {/* Connect Platform Section */}
      <section
        id="connect"
        data-section="connect"
        className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
      >
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          Hubungkan Platform
        </h3>
        <ReplizConnectButtons />
      </section>

      {/* Pending Section */}
      <ReplizPendingSelection />

      {/* Connected Accounts Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
            Akun Terhubung
          </h3>
          <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
            {accountCount} {accountCount === 1 ? "akun" : "akun"}
          </span>
        </div>
        <ReplizLocalConnectionList teamId={activeTeam.id} />
      </section>
    </div>
  );
}