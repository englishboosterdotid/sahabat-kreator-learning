"use client";

import { ReactNode, useState } from "react";

import { AppHeader } from "./app-header";
import { MobileSidebar } from "./mobile-sidebar";
import { DesktopSidebar } from "./desktop-sidebar";

type User = {
  name: string;
  email: string;
  image?: string | null;
};

type Props = {
  children: ReactNode;
  sidebarContent: ReactNode;
  user: User;
};

export function AppShell({
  children,
  sidebarContent,
  user,
}: Props) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <MobileSidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        content={sidebarContent}
      />

      <DesktopSidebar content={sidebarContent} />

      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader
          user={user}
          onOpenSidebar={() => setIsMobileSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}