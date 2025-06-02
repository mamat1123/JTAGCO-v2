import { Profile, Profiles, UpdateProfileDTO, UpdateLastActiveResponse, ProfileApprovalPayload } from './profile';
import { api } from '@/shared/config/api';

export const profileAPI = {
  async getProfile(): Promise<Profiles> {
    const response = await api.get<Profiles>('/profiles');
    return response.data;
  },

  async getProfileByUserId(userId: string): Promise<Profile> {
    const response = await api.get<Profile>(`/profiles/user/${userId}`);
    return response.data;
  },

  async updateProfile(profile: UpdateProfileDTO): Promise<Profile> {
    const response = await api.patch<Profile>('/profiles', profile);
    return response.data;
  },

  async updateLastActive(): Promise<UpdateLastActiveResponse> {
    const response = await api.post<UpdateLastActiveResponse>('/profiles/last-active');
    return response.data;
  },

  async approveProfile(payload: ProfileApprovalPayload): Promise<Profile> {
    const response = await api.post<Profile>(`/profiles/${payload.profileId}/approve`, {
      status: payload.status,
    });
    return response.data;
  }
}; 