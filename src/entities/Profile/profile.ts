export type ProfileStatus = 'wait_for_approve' | 'approved' | 'rejected';

export interface Profile {
  id: string;
  user_id: string;
  username: string;
  phone: string;
  role: string;
  user_email: string;
  email: string;
  fullname: string;
  lastActive: string;
  status: ProfileStatus;
}

export type Profiles = Profile[] | [];

export interface UpdateProfileDTO {
  username?: string;
  phone?: string;
  email?: string;
  user_email?: string;
}

export interface UpdateLastActiveResponse {
  success: boolean;
  lastActive: string;
}

export interface ProfileApprovalPayload {
  profileId: string;
  status: 'approved' | 'rejected';
  reason?: string;
} 