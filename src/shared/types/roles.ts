export enum UserRole {
  ADMIN = 'admin',
  SALES = 'sales',
  MANAGER = 'manager',
  SUPER_ADMIN = 'super admin',
}

export const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'ADMIN',
  [UserRole.SALES]: 'SALES',
  [UserRole.MANAGER]: 'MANAGER',
  [UserRole.SUPER_ADMIN]: 'SUPER ADMIN',
};

export const ROLE_OPTIONS = Object.entries(ROLE_LABELS).map(([value, label]) => ({
  value,
  label,
})); 