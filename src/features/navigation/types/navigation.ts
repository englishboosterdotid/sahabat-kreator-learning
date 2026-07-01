export type NavigationItem = {
  title: string;
  href: string;
  iconName: string;
  badge?: string;
  disabled?: boolean;
};

export type NavigationSection = {
  title: string;
  items: NavigationItem[];
};