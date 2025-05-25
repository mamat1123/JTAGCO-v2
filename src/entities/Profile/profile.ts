export interface Profile {
  id: string;
  user_id: string;
  username: string;
  phone: string;
  role: string;
  user_email: string;
  email: string;
  fullname: string;
}

export type Profiles = Profile[] | [];

export interface UpdateProfileDTO {
  username?: string;
  phone?: string;
  email?: string;
  user_email?: string;
} 