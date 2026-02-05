export enum EventStatus {
  PLANNED = 'planned',
  COMPLETED = 'completed',
}

export interface BackendEvent {
  id: string;
  company_id: string;
  user_id: number;
  main_type_id: number;
  sub_type_id: number;
  description: string;
  scheduled_at: string;
  test_start_at: string | null;
  test_end_at: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  companyName: string;
  userFullName: string;
  subTypeName: string;
  mainTypeName: string;
  customers?: {
    email: string;
    phone: string;
    contact_name: string;
  };
  sales_before_vat?: number;
  business_type?: string;
  shoe_order_quantity?: number;
  has_appointment?: boolean;
  purchase_months?: string[];
  test_result?: string;
  test_result_reason?: string;
  got_job?: string;
  got_job_reason?: string;
  problem_type?: string;
  present_time?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
  description?: string;
  location?: string;
  company_id?: string;
  companyName?: string;
  userFullName?: string;
  subTypeName?: string;
  mainTypeName?: string;
  status?: EventStatus;
  scheduled_at?: string;
  scheduled_at_start?: string;
  scheduled_at_end?: string;
  main_type_id?: number;
  sub_type_id?: number;
  user_id?: string | number;
  eventImages?: string[];
  eventCheckins?: {
    detail: string;
    created_at: string;
  }[];
  taggedProducts?: {
    id: string;
    name: string;
    price: number;
  }[];
  customers?: {
    email: string;
    phone: string;
    contact_name: string;
  };
  // Conditional fields
  sales_before_vat?: number;
  business_type?: string;
  shoe_order_quantity?: number;
  has_appointment?: boolean;
  purchase_months?: string[];
  test_result?: string;
  test_result_reason?: string;
  got_job?: string;
  got_job_reason?: string;
  problem_type?: string;
  present_time?: string;
}

export interface QueryEventDto {
  company_id?: string;
  status?: EventStatus;
  scheduled_at_start?: string;
  scheduled_at_end?: string;
  main_type_id?: string;
  sub_type_id?: string;
  search?: string;
  user_id?: string;
  tagged_product_id?: string;
}

export interface CalendarProps {
  events?: CalendarEvent[];
  className?: string;
}

export interface EventProduct {
  variant_id: string;
  quantity: number;
}

export interface CreateEventDto {
  description: string;
  scheduled_at: string;
  test_start_at: string;
  test_end_at: string;
  main_type_id: string;
  sub_type_id: string;
  company_id: string;
  customer_id: string;
  image_urls: string[];
  products: EventProduct[];
  sales_before_vat?: number;
  business_type?: string;
  shoe_order_quantity?: number;
  has_appointment?: boolean;
  purchase_months?: string[];
  test_result?: string;
  test_result_reason?: string;
  got_job?: string;
  got_job_reason?: string;
  problem_type?: string;
  present_time?: string;
}

export interface UpdateEventDto extends Partial<CreateEventDto> {
  id: string;
}

export interface EventMainType {
  id: number;
  code: string;
  name: string;
}

export interface EventSubType {
  id: number;
  code: string;
  name: string;
  main_type_id: number;
}