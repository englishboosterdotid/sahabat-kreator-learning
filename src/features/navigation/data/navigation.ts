import type { NavigationSection } from "../types/navigation";

export const navigation: NavigationSection[] = [
  {
    title: "OVERVIEW",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        iconName: "House",
      },
    ],
  },
  {
    title: "CONTENT",
    items: [
      {
        title: "AI Studio",
        href: "/ai",
        iconName: "Sparkle",
      },
      {
        title: "Posts",
        href: "/posts",
        iconName: "Article",
      },
      {
        title: "Calendar",
        href: "/calendar",
        iconName: "CalendarDots",
      },
    ],
  },
  {
    title: "ENGAGEMENT",
    items: [
      {
        title: "Inbox",
        href: "/inbox",
        iconName: "ChatCircleText",
      },
      {
        title: "Comments",
        href: "/comments",
        iconName: "ChatTeardropText",
      },
    ],
  },
  {
    title: "WORKSPACE",
    items: [
      {
        title: "Brands",
        href: "/brands",
        iconName: "Buildings",
      },
      {
        title: "Social Accounts",
        href: "/accounts",
        iconName: "ShareNetwork",
      },
      {
        title: "Assets",
        href: "/assets",
        iconName: "Folder",
      },
      {
        title: "Members",
        href: "/members",
        iconName: "Users",
      },
    ],
  },
  {
    title: "REPORTS",
    items: [
      {
        title: "Analytics",
        href: "/analytics",
        iconName: "ChartBar",
      },
    ],
  },
  {
    title: "SETTINGS",
    items: [
      {
        title: "Settings",
        href: "/settings",
        iconName: "Gear",
      },
    ],
  },
];