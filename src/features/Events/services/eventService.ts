import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarEvent, CreateEventDto, UpdateEventDto, QueryEventDto, BackendEvent } from "@/shared/types/events";
import { api } from "@/shared/config/api";

const EVENTS_ENDPOINT = "/events";

export const useEvents = (query?: QueryEventDto) => {
  return useQuery({
    queryKey: ["events", query],
    queryFn: async () => {
      const { data } = await api.get<BackendEvent[]>(EVENTS_ENDPOINT, {
        params: query,
      });
      return data;
    },
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (event: CreateEventDto) => {
      const { data } = await api.post<CalendarEvent>(EVENTS_ENDPOINT, event);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (event: UpdateEventDto) => {
      const { data } = await api.put<CalendarEvent>(`${EVENTS_ENDPOINT}/${event.id}`, event);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventId: string) => {
      await api.delete(`${EVENTS_ENDPOINT}/${eventId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

export const useEventDetail = (eventId: string | null) => {
  return useQuery({
    queryKey: ["event", eventId],
    queryFn: async () => {
      if (!eventId) return null;
      const { data } = await api.get<CalendarEvent>(`${EVENTS_ENDPOINT}/${eventId}`);
      return data;
    },
    enabled: !!eventId,
  });
};

export const useReceiveShoeVariants = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventId: string) => {
      const { data } = await api.patch<CalendarEvent>(`${EVENTS_ENDPOINT}/${eventId}/receive-shoe-variants`);
      return data;
    },
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
      queryClient.invalidateQueries({ queryKey: ["event-timeline", eventId] });
    },
  });
}; 