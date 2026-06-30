"use client";

import { signOutAction } from "@/features/auth/presentation/actions";
import { Button } from "@/components/ui/button";
import { SignOut } from "@phosphor-icons/react";

type User = {
  name: string;
  email: string;
  image?: string | null;
};

type Props = {
  user: User;
};

export function SidebarFooter({ user }: Props) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
      <div className="flex items-center gap-3 mb-4">
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
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">
            {user.name}
          </p>
          <p className="text-xs text-zinc-500 truncate">{user.email}</p>
        </div>
      </div>

      <form action={signOutAction}>
        <Button
          type="submit"
          variant="ghost"
          className="w-full justify-start gap-2 text-zinc-600 hover:text-red-600 dark:text-zinc-300 dark:hover:text-red-400"
        >
          <SignOut size={18} />
          Logout
        </Button>
      </form>
    </div>
  );
}