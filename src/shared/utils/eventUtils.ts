import { CalendarEvent } from "@/shared/types/events";

export const getEventTypeClass = (event: CalendarEvent) => {
  const { sub_type_id, main_type_id } = event;
  if (main_type_id === 1) {
    return "bg-blue-100 text-blue-800";
  } else if (sub_type_id === 10) {
    return "bg-rose-100 text-rose-800";
  } else if (sub_type_id === 6) {
    return "bg-red-200 text-red-900";
  }
  return 'bg-orange-100 text-orange-800';
}; 