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
  status?: EventStatus;
  scheduled_at_start?: string;
  scheduled_at_end?: string;
  main_type_id?: number;
  sub_type_id?: number;
  userId?: string | number;
  eventImages?: string[];
  eventCheckins?: {
    detail: string;
    created_at: string;
  }[];
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
}

export interface CalendarProps {
  events?: CalendarEvent[];
  className?: string;
}

export interface CreateEventDto {
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
  description?: string;
  location?: string;
  company_id?: string;
  status?: EventStatus;
  main_type_id?: string;
  sub_type_id?: string;
}

export interface UpdateEventDto extends Partial<CreateEventDto> {
  id: string;
}

export interface EventMainType {
  id: number;
  code: string;
  name: string;
}