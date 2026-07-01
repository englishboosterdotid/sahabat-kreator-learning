import { listTeams } from "../../application/services/team-service";
import { auth } from "@/lib/auth/server";
import { headers } from "next/headers";
import { TeamSwitcher } from "./team-switcher";

export async function TeamSwitcherServer() {
  const fullOrg = await (auth as any).api.getFullOrganization({
    headers: await headers(),
  });

  const teams = fullOrg?.teams || [];
  const activeTeam = fullOrg?.activeTeam || null;

  return <TeamSwitcher teams={teams} activeTeam={activeTeam} />;
}
