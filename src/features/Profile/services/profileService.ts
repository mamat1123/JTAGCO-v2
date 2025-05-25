import { Profile, Profiles, UpdateProfileDTO } from '@/entities/Profile/profile';
import { profileAPI } from '@/entities/Profile/profileAPI';

export class ProfileService {
  private static instance: ProfileService;

  private constructor() {}

  public static getInstance(): ProfileService {
    if (!ProfileService.instance) {
      ProfileService.instance = new ProfileService();
    }
    return ProfileService.instance;
  }

  async getProfile(): Promise<Profiles> {
    try {
      return await profileAPI.getProfile();
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw new Error('Failed to fetch profile');
    }
  }

  async updateProfile(profile: UpdateProfileDTO): Promise<Profile> {
    try {
      return await profileAPI.updateProfile(profile);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw new Error('Failed to update profile');
    }
  }

  async getProfileByUserId(userId: string): Promise<Profile> {
    try {
      return await profileAPI.getProfileByUserId(userId);
    } catch (error) {
      console.error('Error fetching profile by user id:', error);
      throw new Error('Failed to fetch profile');
    }
  }
}

export const profileService = ProfileService.getInstance(); 