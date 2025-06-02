export enum EventStatus {
  PLANNED = 'planned',
  COMPLETED = 'completed',
}

export interface Event {
  id: string;
  company_id: string;
  user_id: number;
  main_type_id: number;
  sub_type_id: number;
  description?: string;
  scheduled_at: string;
  test_start_at?: string;
  test_end_at?: string;
  status: EventStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateEventDto {
  company_id: string;
  user_id: number;
  main_type_id: number;
  sub_type_id: number;
  description?: string;
  scheduled_at: string;
  test_start_at?: string;
  test_end_at?: string;
  status?: EventStatus;
}

export interface UpdateEventDto extends Partial<CreateEventDto> {}

export interface QueryEventParams {
  company_id?: string;
  status?: EventStatus;
  scheduled_at_start?: string;
  scheduled_at_end?: string;
  main_type_id?: string;
  sub_type_id?: string;
} 

export interface EventCheckinDto {
  detail?: string;
  images?: string[];
}