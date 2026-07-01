"use client";

import { ReactNode } from "react";
import { X } from "@phosphor-icons/react";
import { SidebarLogo } from "./sidebar-logo";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  content: ReactNode;
};

export function MobileSidebar({ isOpen, onClose, content }: Props) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className="fixed left-0 top-0 z-50 flex h-full w-72 flex-col bg-white dark:bg-zinc-950 transition-transform lg:hidden"
        style={{ transform: isOpen ? "translateX(0)" : "translateX(-100%)" }}
      >
        <div className="flex h-16 items-center justify-between border-b border-zinc-200 px-6 dark:border-zinc-800">
          <SidebarLogo />
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto">{content}</div>
      </aside>
    </>
  );
}
