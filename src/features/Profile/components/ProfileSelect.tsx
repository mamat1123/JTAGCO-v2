import { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Profiles } from '@/entities/Profile/profile';
import { profileService } from '../services/profileService';

interface ProfileSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export function ProfileSelect({ value, onValueChange, placeholder = 'Select profile' }: ProfileSelectProps) {
  const [profiles, setProfiles] = useState<Profiles>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        const profiles = await profileService.getProfile();
        setProfiles(profiles);
        setError(null);
      } catch (err) {
        setError('Failed to load profiles');
        console.error('Error loading profiles:', err);
        setProfiles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);
  if (loading) {
    return <div className="h-10 w-full animate-pulse rounded-md bg-muted" />;
  }

  if (error) {
    return <div className="text-sm text-destructive">{error}</div>;
  }

  if (profiles.length === 0) {
    return (
      <Select value={value} onValueChange={onValueChange} disabled>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="No profiles available" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none" disabled>No profiles available</SelectItem>
        </SelectContent>
      </Select>
    );
  }

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">ทั้งหมด</SelectItem>
        {profiles.map((profile) => (
          <SelectItem key={profile.id} value={profile.id}>
            {profile.fullname}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
} 