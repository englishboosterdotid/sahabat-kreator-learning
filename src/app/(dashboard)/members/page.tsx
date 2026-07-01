import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { MembersList } from "@/features/organization/presentation/components/members-list";
import { listMembers } from "@/features/organization/application/services/member-service";
import { listInvitations } from "@/features/organization/application/services/invitation-service";

export const dynamic = "force-dynamic";

export default async function MembersPage() {
  const session = await getSession();
  if (!session) redirect("/sign-in");

  const resultMembers = await listMembers();
  const resultInvitations = await listInvitations();

  // Handle both possible response formats (array directly or object with members/invitations property)
  const members = Array.isArray(resultMembers) 
    ? resultMembers 
    : (resultMembers as any)?.members || [];
  
  const invitations = Array.isArray(resultInvitations) 
    ? resultInvitations 
    : (resultInvitations as any)?.invitations || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Members
        </h1>
      </div>
      <MembersList 
        initialMembers={members} 
        initialInvitations={invitations} 
      />
    </div>
  );
}
