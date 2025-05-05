export enum UserRole {
  ADMIN = 'admin',
  SALES = 'sales',
  MANAGER = 'manager',
}

export const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'ADMIN',
  [UserRole.SALES]: 'SALES',
  [UserRole.MANAGER]: 'MANAGER',
};

export const ROLE_OPTIONS = Object.entries(ROLE_LABELS).map(([value, label]) => ({
  value,
  label,
})); 