export interface Profile {
  id: number;
  user_id: string | null;
  username: string;
  phone: string;
  role: ProfileRole;
  user_email: string | null;
  email: string | null;
  fullname: string;
  last_active_at: string;
  is_online: boolean;
  status: ProfileStatus;
}

export enum ProfileRole {
  SUPER_ADMIN = "super admin",
  ADMIN = "admin",
  MANAGER = "manager",
  SALES = "sales"
}

export enum ProfileStatus {
  APPROVED = "approved",
  PENDING = "pending",
  REJECTED = "rejected"
}

export interface ProfileFilters {
  search?: string;
  role?: ProfileRole;
  status?: ProfileStatus;
} 