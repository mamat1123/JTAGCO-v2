import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/config/api";

export interface ApprovalData {
  id: string;
  event_id: string;
  variant_id: string;
  quantity: number;
  status: "approved" | "rejected" | "pending" | "returned";
  requested_by: number;
  approved_by?: number;
  approved_at?: string;
  reason: string;
  note?: string | null;
  created_at: string;
  updated_at: string;
  return_date: string;
  pickup_date: string;
  product_variants: {
    id: string;
    sku: string;
    price: number;
    stock: number;
    products: {
      id: string;
      name: string;
    };
    attributes: {
      [key: string]: string;
    };
  };
}

export interface EventTimelineStep {
  id: number;
  title: string;
  description: string;
  date: string;
  status: "completed" | "current" | "pending";
  data?: ApprovalData[];
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