export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  type?: "default" | "success" | "warning" | "error" | "info";
} 