import { api } from "@/shared/config/api";

export interface EventSubType {
  id: number;
  mainTypeId: number;
  code: string;
  name: string;
}

export const eventSubTypeService = {
  getByMainType: async (mainTypeId: string): Promise<EventSubType[]> => {
    const { data } = await api.get<EventSubType[]>(`/event-sub-types/main-type/${mainTypeId}`);
    return data;
  },
}; 