import type { UserRole } from "@/types/inventory";

export type AppRole = Extract<UserRole, "ADMIN" | "MANAGER">;

export type NavItem = {
  label: string;
  href: string;
  icon: string;
};

export type NavSection = {
  sectionLabel: string;
  items: NavItem[];
};

export const navigationByRole: Record<AppRole, NavSection[]> = {
  ADMIN: [
    {
      sectionLabel: "Overview",
      items: [
        { label: "Dashboard", href: "/dashboard", icon: "📊" },
        { label: "Analytics", href: "/dashboard/analytics", icon: "📈" },
      ],
    },
    {
      sectionLabel: "Management",
      items: [
        { label: "Categories", href: "/dashboard/categories", icon: "📂" },
        { label: "Products", href: "/dashboard/products", icon: "📦" },
      ],
    },
    {
      sectionLabel: "Operations",
      items: [
        { label: "Orders", href: "/dashboard/orders", icon: "📋" },
        { label: "Restock Queue", href: "/dashboard/low-stock", icon: "⚠️" },
      ],
    },
    {
      sectionLabel: "System",
      items: [
        { label: "Users", href: "/dashboard/users", icon: "👥" },
        { label: "Activity Log", href: "/dashboard/activity", icon: "📜" },
      ],
    },
  ],
  MANAGER: [
    {
      sectionLabel: "Overview",
      items: [
        { label: "Dashboard", href: "/dashboard", icon: "📊" },
      ],
    },
    {
      sectionLabel: "Management",
      items: [
        { label: "Categories", href: "/dashboard/categories", icon: "📂" },
        { label: "Products", href: "/dashboard/products", icon: "📦" },
      ],
    },
    {
      sectionLabel: "Operations",
      items: [
        { label: "Orders", href: "/dashboard/orders", icon: "📋" },
        { label: "Restock Queue", href: "/dashboard/low-stock", icon: "⚠️" },
      ],
    },
  ],
};

const adminOnlyPrefixes = [
  "/dashboard/users",
  "/dashboard/activity",
  "/dashboard/analytics",
];

const managerOnlyPrefixes: string[] = [];

export function normalizeRole(role?: UserRole | null): AppRole {
  return role === "ADMIN" ? "ADMIN" : "MANAGER";
}

export function canAccessPath(role: AppRole, pathname: string): boolean {
  if (adminOnlyPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return role === "ADMIN";
  }

  if (managerOnlyPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return role === "MANAGER";
  }

  return pathname.startsWith("/");
}
