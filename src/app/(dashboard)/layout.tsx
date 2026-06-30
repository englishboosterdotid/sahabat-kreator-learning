import { AppShell } from "@/features/navigation/presentation/components/app-shell";
import { ensureDefaultOrganization } from "@/features/organization/application/use-cases/ensure-default-organization";
import { requireAuth } from "@/lib/auth";
import { SidebarContent } from "@/features/navigation/presentation/components/sidebar-content";
import { ReactNode } from "react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAuth();

  await ensureDefaultOrganization({
    userName: session.user.name,
  });

  return (
    <AppShell 
      sidebarContent={<SidebarContent user={session.user} />}
      user={session.user}
    >
      {children}
    </AppShell>
  );
}