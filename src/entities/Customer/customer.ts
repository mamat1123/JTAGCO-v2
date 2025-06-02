export interface Customer {
  id: string;
  company_id: string;
  contact_name: string;
  position: string;
  email: string;
  phone: string;
  line_id: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CustomerResponse {
  data: Customer[];
  total: number;
  page: number;
  limit: number;
}

export interface CustomerFilters {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateCustomerDTO {
  company_id: string;
  contact_name: string;
  position: string;
  email: string;
  phone?: string;
  line_id?: string;
}

export interface UpdateCustomerDto {
  company_id: string;
  contact_name?: string;
  position?: string;
  email?: string;
  phone?: string;
  line_id?: string;
}