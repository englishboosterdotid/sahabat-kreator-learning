"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Article,
  Buildings,
  CalendarDots,
  ChartBar,
  ChatCircleText,
  ChatTeardropText,
  Folder,
  Gear,
  House,
  ShareNetwork,
  Sparkle,
  Users,
} from "@phosphor-icons/react";

import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  House,
  Sparkle,
  Article,
  CalendarDots,
  ChatCircleText,
  ChatTeardropText,
  Buildings,
  ShareNetwork,
  Folder,
  Users,
  ChartBar,
  Gear,
};

type Props = {
  title: string;
  href: string;
  iconName: string;
};

export function NavItem({
  title,
  href,
  iconName,
}: Props) {
  const pathname = usePathname();

  const active = pathname === href;
  const Icon = iconMap[iconName];

  if (!Icon) {
    return null;
  }

  return (
    <Link
      href={href}
      className={cn(
        "flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors",
        active
          ? "bg-indigo-600 text-white"
          : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
      )}
    >
      <Icon size={20} />

      {title}
    </Link>
  );
}