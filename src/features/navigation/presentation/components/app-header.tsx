"use client";

import { List, Bell, Gear, SignOut } from "@phosphor-icons/react";
import { useState } from "react";
import Link from "next/link";
import { signOutAction } from "@/features/auth/presentation/actions";

type User = {
  name: string;
  email: string;
  image?: string | null;
};

type Props = {
  onOpenSidebar?: () => void;
  user: User;
};

export function AppHeader({ onOpenSidebar, user }: Props) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-6 dark:border-zinc-800 dark:bg-zinc-950">
      <button onClick={onOpenSidebar} className="lg:hidden">
        <List size={24} />
      </button>

      <h1 className="font-semibold">Dashboard</h1>

      <div className="flex items-center gap-4">
        {/* Notifikasi */}
        <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full">
          <Bell size={20} />
        </button>

        {/* User Avatar & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 rounded-full p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white font-semibold text-sm">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                getInitials(user.name)
              )}
            </div>
          </button>

          {isDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsDropdownOpen(false)}
              />
              <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
                <div className="p-2">
                  <Link
                    href="/settings"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    <Gear size={18} />
                    Pengaturan
                  </Link>
                  <form action={signOutAction} className="w-full">
                    <button
                      type="submit"
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      <SignOut size={18} />
                      Logout
                    </button>
                  </form>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
