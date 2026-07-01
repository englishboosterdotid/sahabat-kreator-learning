import { navigation } from "../../data/navigation";
import { NavItem } from "./nav-item";

export function AppSidebar() {
  return (
    <aside className="hidden w-72 border-r border-zinc-200 bg-white lg:flex lg:flex-col dark:border-zinc-800 dark:bg-zinc-950">
      <div className="border-b border-zinc-200 p-6 dark:border-zinc-800">
        <h2 className="text-lg font-bold">
          Sahabat Kreator
        </h2>
      </div>

      <nav className="flex flex-1 flex-col gap-4 p-4">
        {navigation.map((section) => (
          <div key={section.title} className="flex flex-col gap-1">
            <h3 className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 px-3">
              {section.title}
            </h3>
            {section.items.map((item) => (
              <NavItem
                key={item.href}
                {...item}
              />
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}