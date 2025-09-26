import { Customer } from '../Customer/customer';

export interface Position {
  lat: string | null;
  lng: string | null;
}

export interface InactiveCompany {
  id: number;
  name: string;
  lastEventUpdatedAt: string | null;
  province: string;
  branch: string;
  totalEmployees: number;
  credit: number;
}

export interface Company {
  id: string;
  created_at: string;
  name: string;
  business_type_id: number;
  tax_id: string | null;
  branch: string | null;
  address: string | null;
  province: string | null;
  zipCode: string | null;
  email: string | null;
  position: Position | null;
  previous_model: string | null;
  issues_encountered_list: string;
  old_price: number;
  job_description: string | null;
  total_employees: number | null;
  credit: number;
  order_cycle: number;
  business_type_detail: string | null;
  competitor_details: string | null;
  sub_district: string | null;
  updated_at: string;
  district: string | null;
  detail: string | null;
  zip_code: string | null;
  user_id: string | null;
  customers: Customer[];
}

export interface CreateCompanyDTO {
  name: string;
  email?: string;
  credit: number;
  tax_id: string;
  branch: string;
  business_type_id?: number;
  user_id?: string;
  order_cycle: number;
}

export interface UpdateCompanyDTO {
  name?: string;
  business_type_id?: number;
  tax_id?: string | null;
  branch?: string | null;
  address?: string | null;
  province?: string | null;
  email?: string | null;
  position?: Position | null;
  previous_model?: string | null;
  issues_encountered_list?: string;
  old_price?: number;
  job_description?: string | null;
  total_employees?: number | null;
  credit: number;
  order_cycle: number;
  business_type_detail?: string | null;
  competitor_details?: string | null;
  sub_district?: string | null;
  district?: string | null;
  detail?: string | null;
  zip_code?: number | null;
}

export interface CompanyResponse {
  data: Company[];
  total: number;
}

export interface CompanyFilters {
  search?: string;
  page?: number;
  limit?: number;
  name?: string;
  province?: string;
  email?: string;
  user_id?: string;
  tagged_product_id?: string;
}

export interface InactiveCompaniesDto {
  page?: number;
  limit?: number;
  months?: number;
  sortBy?: 'last_event_updated_at' | 'credit' | 'total_employees';
  sortOrder?: 'asc' | 'desc';
  search?: string;
  province?: string;
  branch?: string;
  user_id?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface InactiveCompanyStats {
  total_companies: number;
  total_employees: number;
  avg_credit: number;
  never_updated: number;
  by_province: {
    province: string;
    count: number;
  }[];
  by_branch: {
    branch: string;
    count: number;
  }[];
  credit_distribution: {
    range: string;
    count: number;
  }[];
}

export interface CompanyDto {
  id: string;
  name: string;
  branch: string | null;
  email: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}