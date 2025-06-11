import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/config/api";

export interface EventTimelineStep {
  id: number;
  title: string;
  description: string;
  date: string;
  status: "completed" | "current" | "pending";
}

export const useEventTimeline = (eventId: string | null) => {
  return useQuery({
    queryKey: ["event-timeline", eventId],
    queryFn: async () => {
      if (!eventId) return null;
      const response = await api.get<EventTimelineStep[]>(`/events/${eventId}/request-timeline`);
      return response.data;
    },
    enabled: !!eventId,
  });
}; 