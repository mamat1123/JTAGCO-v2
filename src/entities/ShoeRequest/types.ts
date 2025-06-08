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
  eventDescription: string;
}

export interface ShoeRequestFilters {
  searchTerm?: string;
  status?: "pending" | "approved" | "rejected" | "all";
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