"use client";

import { signOutAction } from "@/features/auth/presentation/actions";
import { Button } from "@/components/ui/button";
import { SignOut } from "@phosphor-icons/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type User = {
  name: string;
  email: string;
  image?: string | null;
};

type Props = {
  user: User;
};

export function SidebarFooter({ user }: Props) {
  return (
    <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
      <div className="mb-4 flex items-center gap-3">
        <Avatar className="h-9 w-9">
          {user.image && <AvatarImage src={user.image} alt={user.name} />}
          <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">
            {user.name}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
            {user.email}
          </p>
        </div>
      </div>
      <form action={signOutAction}>
        <Button type="submit" variant="ghost" className="w-full justify-start gap-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white">
          <SignOut size={18} />
          Logout
        </Button>
      </form>
    </div>
  );
}