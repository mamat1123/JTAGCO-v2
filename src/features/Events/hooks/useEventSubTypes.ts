import { useQuery } from '@tanstack/react-query';
import { eventSubTypeService, EventSubType } from '../services/eventSubTypeService';

export type { EventSubType };

export const useEventSubTypes = (mainTypeId?: string) => {
  return useQuery({
    queryKey: ['eventSubTypes', mainTypeId],
    queryFn: () => eventSubTypeService.getByMainType(mainTypeId!),
    enabled: !!mainTypeId && mainTypeId !== 'all',
  });
}; 