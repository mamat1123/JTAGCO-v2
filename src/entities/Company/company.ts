import { Customer } from '../Customer/customer';

export interface Position {
  lat: string | null;
  lng: string | null;
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
}

export interface UpdateCompanyDTO {
  name?: string;
  business_type_id?: number;
  tax_id?: string | null;
  branch?: string | null;
  address?: string | null;
  province?: string | null;
  zipCode?: string | null;
  email?: string | null;
  position?: Position | null;
  previous_model?: string | null;
  issues_encountered_list?: string;
  old_price?: number;
  job_description?: string | null;
  total_employees?: number | null;
  credit?: number;
  order_cycle?: number;
  business_type_detail?: string | null;
  competitor_details?: string | null;
  sub_district?: string | null;
  district?: string | null;
  detail?: string | null;
  zip_code?: string | null;
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
} 