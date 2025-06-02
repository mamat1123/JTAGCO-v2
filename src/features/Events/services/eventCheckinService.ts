import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/config/api";
import { EventCheckinDto } from "@/entities/Event/types";

interface EventCheckin {
  id: number;
  event_id: number;
  detail: string;
  created_at: string;
}

export function useEventCheckins(eventId: string | null) {
  return useQuery({
    queryKey: ["event-checkins", eventId],
    queryFn: async () => {
      if (!eventId) return null;
      const response = await api.get<EventCheckin[]>(`/event-checkins/event/${eventId}`);
      return response.data;
    },
    enabled: !!eventId,
  });
}

export function useCreateEventCheckin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventId, data }: { eventId: string; data: EventCheckinDto }) => {
      const response = await api.post<EventCheckin>(`/event-checkins/event/${eventId}/checkin`, data);
      return response.data;
    },
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ["event-checkins", eventId] });
    },
  });
} 