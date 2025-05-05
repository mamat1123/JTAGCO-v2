import { Customer } from '../Customer/customer';

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
  position: string | null;
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
  phone?: string;
  address?: string;
  province?: string;
  credit: number;
}

export interface CompanyResponse {
  data: Company[];
  total: number;
}

export interface CompanyFilters {
  search?: string;
  page?: number;
  limit?: number;
} 