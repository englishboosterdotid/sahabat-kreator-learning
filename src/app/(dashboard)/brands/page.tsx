import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BrandsList } from "@/features/team/presentation/components/brands-list";
import { listTeamsWithMembers } from "@/features/team/application/services/team-service";
import { auth } from "@/lib/auth/server";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export default async function BrandsPage() {
  const session = await getSession();
  if (!session) redirect("/sign-in");

  const fullOrg = await (auth as any).api.getFullOrganization({
    headers: await headers(),
  });
  // Gunakan listTeamsWithMembers() untuk mendapatkan teams beserta members dari DB
  const teamsWithMembers = await listTeamsWithMembers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Brands
        </h1>
      </div>
      <BrandsList 
        initialTeams={teamsWithMembers || []}
        initialOrganizationMembers={fullOrg?.members || []}
        currentUserId={session.user.id}
      />
    </div>
  );
}
