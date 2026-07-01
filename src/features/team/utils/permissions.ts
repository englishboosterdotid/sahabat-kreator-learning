import { TEAM_ROLES, type TeamRole } from "../types/roles";

type Permission =
  | "view_brand"
  | "edit_brand"
  | "delete_brand"
  | "manage_brand_members";

const rolePermissions: Record<TeamRole, Permission[]> = {
  [TEAM_ROLES.TEAM_OWNER]: [
    "view_brand",
    "edit_brand",
    "delete_brand",
    "manage_brand_members",
  ],
  [TEAM_ROLES.TEAM_ADMIN]: [
    "view_brand",
    "edit_brand",
    "manage_brand_members",
  ],
  [TEAM_ROLES.TEAM_MEMBER]: [
    "view_brand",
  ],
  [TEAM_ROLES.TEAM_VIEWER]: [
    "view_brand",
  ],
};

export function hasPermission(
  role: TeamRole | undefined,
  permission: Permission
): boolean {
  if (!role) return false;
  return rolePermissions[role]?.includes(permission) ?? false;
}

export function canEditBrand(role: TeamRole | undefined): boolean {
  return hasPermission(role, "edit_brand");
}

export function canDeleteBrand(role: TeamRole | undefined): boolean {
  return hasPermission(role, "delete_brand");
}

export function canManageBrandMembers(role: TeamRole | undefined): boolean {
  return hasPermission(role, "manage_brand_members");
}
