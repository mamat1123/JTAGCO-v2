import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/config/api";
import { EventMainType, EventSubType } from "@/shared/types/events";

export const useEventMainTypes = () => {
  return useQuery({
    queryKey: ["eventMainTypes"],
    queryFn: async () => {
      const { data } = await api.get<EventMainType[]>("/event-main-types");
      return data;
    },
  });
};

export const useEventSubTypes = (mainTypeId?: string) => {
  return useQuery({
    queryKey: ["eventSubTypes", mainTypeId],
    queryFn: async () => {
      const { data } = await api.get<EventSubType[]>("/event-sub-types", {
        params: { main_type_id: mainTypeId },
      });
      return data;
    },
    enabled: !!mainTypeId,
  });
}; 