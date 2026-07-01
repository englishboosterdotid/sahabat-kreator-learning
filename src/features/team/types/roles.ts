// Definisikan role team secara eksplisit untuk type safety dan scalability
export const TEAM_ROLES = {
  TEAM_OWNER: 'team_owner',
  TEAM_ADMIN: 'team_admin',
  TEAM_MEMBER: 'team_member',
  TEAM_VIEWER: 'team_viewer',
} as const;

export type TeamRole = typeof TEAM_ROLES[keyof typeof TEAM_ROLES];

// Helper untuk mendapatkan list role (untuk dropdown)
export const getTeamRoleOptions = () => [
  { value: TEAM_ROLES.TEAM_OWNER, label: 'Owner' },
  { value: TEAM_ROLES.TEAM_ADMIN, label: 'Admin' },
  { value: TEAM_ROLES.TEAM_MEMBER, label: 'Member' },
  { value: TEAM_ROLES.TEAM_VIEWER, label: 'Viewer' },
];
