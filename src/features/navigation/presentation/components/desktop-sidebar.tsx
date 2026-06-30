import { ReactNode } from "react";

type Props = {
  content: ReactNode;
};

export function DesktopSidebar({ content }: Props) {
  return (
    <aside className="hidden w-72 border-r border-zinc-200 bg-white lg:flex lg:flex-col dark:border-zinc-800 dark:bg-zinc-950">
      {content}
    </aside>
  );
}