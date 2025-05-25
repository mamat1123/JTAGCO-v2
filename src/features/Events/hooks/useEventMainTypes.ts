import { useQuery } from '@tanstack/react-query';
import { fetchEventMainTypes } from '../services/eventMainTypeService';
import { EventMainType } from '@/shared/types/events';
import { toast } from 'sonner';

export const useEventMainTypes = () => {
  return useQuery<EventMainType[], Error>({
    queryKey: ['eventMainTypes'],
    queryFn: async () => {
      try {
        return await fetchEventMainTypes();
      } catch (error) {
        toast.error('Failed to fetch event main types');
        console.error('Error fetching event main types:', error);
        throw error;
      }
    },
  });
}; 