export interface Requester {
  name: string;
  department: string;
  employeeId: string;
  avatar?: string;
}

export interface ShoeRequest {
  id: string;
  quantity: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  requesterName: string;
  approverName: string | null;
  productType: string;
  productName: string;
  attributes: {
    size: string;
    color: string;
    image: string;
    steel_plate?: string;
  };
  subTypeName: string;
  mainTypeName: string;
  scheduledAt: string;
  return_date: string;
  pickup_date: string;
  eventDescription: string;
}

export interface EventRequest {
  event_id: string
  event: {
    id: string
    scheduled_at: string
    description?: string
    event_main_types: {
      name: string
    }
    event_sub_types?: {
      name: string
    } | null
  }
  products: Array<{
    id: string
    event_shoe_variant_id: string
    quantity: number
    status: string
    pickup_date?: string
    return_date: string
    reason?: string
    is_fully_returned?: boolean
    returns: Array<{
      id: string
      reason: string
      quantity: number
      returned_at: string
      returned_by: string
      returner_name: string
    }>
    requester: {
      fullname: string
    }
    approver?: {
      fullname: string
    } | null
    product_variant: {
      products: {
        name: string
        type: string
      }
      attributes: {
        size: string
        color?: string
      }
    }
  }>
  created_at?: string
}

export interface ShoeRequestFilters {
  searchTerm?: string;
  status?: "pending" | "approved" | "rejected" | "not_returned" | "all";
  product_type?: "shoe" | "insole" | "all";
  page?: number;
  limit?: number;
}

export interface ShoeRequestStats {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  hasMore: boolean;
  currentPage: number;
} 