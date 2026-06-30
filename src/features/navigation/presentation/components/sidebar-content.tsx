import { SidebarLogo } from "./sidebar-logo";
import { SidebarHeader } from "./sidebar-header";
import { SidebarNav } from "./sidebar-nav";
import { SidebarFooter } from "./sidebar-footer";

type User = {
  name: string;
  email: string;
  image?: string | null;
};

type Props = {
  user: User;
};

export function SidebarContent({ user }: Props) {
  return (
    <>
      <SidebarLogo />
      <SidebarHeader />
      <SidebarNav />
      <SidebarFooter user={user} />
    </>
  );
}
