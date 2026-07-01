import { navigation } from "../../data/navigation";
import { NavItem } from "./nav-item";

export function SidebarNav() {
  return (
    <nav className="flex flex-1 flex-col gap-4 p-4">
      {navigation.map((section) => (
        <div key={section.title} className="flex flex-col gap-1">
          <h3 className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 px-3">
            {section.title}
          </h3>
          {section.items.map((item) => (
            <NavItem
              key={item.href}
              title={item.title}
              href={item.href}
              iconName={item.iconName}
            />
          ))}
        </div>
      ))}
    </nav>
  );
}