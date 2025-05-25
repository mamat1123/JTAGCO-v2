import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { profileService } from '../services/profileService';
import { setProfile, setLoading, setError, clearProfile } from '../store/profileSlice';
import { RootState } from '../../../app/store';

export const useProfile = () => {
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector((state: RootState) => state.profile);

  const fetchProfileByUserId = useCallback(async (userId: string) => {
    try {
      dispatch(setLoading(true));
      const profileData = await profileService.getProfileByUserId(userId);
      dispatch(setProfile(profileData));
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to fetch profile'));
    }
  }, [dispatch]);

  const clearProfileData = useCallback(() => {
    dispatch(clearProfile());
  }, [dispatch]);

  return {
    profile,
    loading,
    error,
    fetchProfileByUserId,
    clearProfileData,
  };
}; 