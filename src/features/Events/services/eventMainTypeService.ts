import { EventMainType } from '@/shared/types/events';
import { api } from "@/shared/config/api";

export const fetchEventMainTypes = async (): Promise<EventMainType[]> => {
  const { data } = await api.get<EventMainType[]>('/event-main-types');
  console.log(data);
  return data;
}; 