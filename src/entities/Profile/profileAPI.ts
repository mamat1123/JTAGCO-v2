import { Profile, Profiles, UpdateProfileDTO } from './profile';
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
  }
}; 