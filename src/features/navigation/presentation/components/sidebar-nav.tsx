import { navigation } from "../../data/navigation";
import { NavItem } from "./nav-item";

export function SidebarNav() {
  return (
    <nav className="flex flex-1 flex-col gap-1 p-4">
      {navigation.map((item) => (
        <NavItem
          key={item.href}
          title={item.title}
          href={item.href}
          iconName={item.iconName}
        />
      ))}
    </nav>
  );
}