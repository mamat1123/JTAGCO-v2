import { calendarAPI } from '@/entities/Calendar/calendarAPI';
import { CalendarEvent } from '@/entities/Calendar/calendar';

export class CalendarService {
  static async fetchEvents(): Promise<CalendarEvent[]> {
    return calendarAPI.fetchEvents();
  }

  static async createEvent(event: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> {
    return calendarAPI.createEvent(event);
  }

  static async updateEvent(event: CalendarEvent): Promise<CalendarEvent> {
    return calendarAPI.updateEvent(event);
  }

  static async deleteEvent(eventId: string): Promise<void> {
    return calendarAPI.deleteEvent(eventId);
  }
} 