import { CalendarEvent } from './calendar';

const sampleEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Ads Campaign Nr2",
    date: new Date(2025, 2, 1), // March 1, 2025
    startTime: "09:00",
    endTime: "17:00",
    type: "default",
  },
  {
    id: "2",
    title: "Ads Campaign Nr2",
    date: new Date(2025, 2, 2), // March 2, 2025
    startTime: "09:00",
    endTime: "17:00",
    type: "default",
  },
  {
    id: "3",
    title: "Ads Campaign Nr2",
    date: new Date(2025, 2, 3), // March 3, 2025
    startTime: "09:00",
    endTime: "17:00",
    type: "default",
  },
  {
    id: "4",
    title: "Ads Campaign Nr2",
    date: new Date(2025, 2, 4), // March 4, 2025
    startTime: "09:00",
    endTime: "17:00",
    type: "default",
  },
  {
    id: "5",
    title: "Ads Campaign Nr2",
    date: new Date(2025, 2, 5), // March 5, 2025
    startTime: "09:00",
    endTime: "17:00",
    type: "default",
  },
  {
    id: "6",
    title: "All-Day Project Sprint",
    date: new Date(2025, 2, 7), // March 7, 2025
    startTime: "00:00",
    endTime: "23:59",
    type: "error",
  },
  {
    id: "7",
    title: "International Client Meeting",
    date: new Date(2025, 2, 9), // March 9, 2025
    startTime: "03:00",
    endTime: "04:00",
    type: "success",
  },
  {
    id: "8",
    title: "Workshop A",
    date: new Date(2025, 2, 10), // March 10, 2025
    startTime: "14:00",
    endTime: "16:00",
    type: "default",
  },
  {
    id: "9",
    title: "Product Development Planning",
    date: new Date(2025, 2, 12), // March 12, 2025
    startTime: "01:00",
    endTime: "05:00",
    type: "default",
  },
  {
    id: "10",
    title: "Investor Presentation",
    date: new Date(2025, 2, 15), // March 15, 2025
    startTime: "06:30",
    endTime: "08:00",
    type: "warning",
  },
  {
    id: "11",
    title: "Team Breakfast",
    date: new Date(2025, 2, 17), // March 17, 2025
    startTime: "07:00",
    endTime: "08:30",
    type: "info",
  },
  {
    id: "12",
    title: "Asia Market Review",
    date: new Date(2025, 2, 19), // March 19, 2025
    startTime: "01:00",
    endTime: "03:00",
    type: "success",
  },
  {
    id: "13",
    title: "Early Strategy Meeting",
    date: new Date(2025, 2, 20), // March 20, 2025
    startTime: "02:00",
    endTime: "04:00",
    type: "warning",
  },
  {
    id: "14",
    title: "Product Launch",
    date: new Date(2025, 2, 22), // March 22, 2025
    startTime: "10:00",
    endTime: "12:00",
    type: "error",
  },
  {
    id: "15",
    title: "Conference A",
    date: new Date(2025, 2, 24), // March 24, 2025
    startTime: "13:00",
    endTime: "15:00",
    type: "success",
  },
  {
    id: "16",
    title: "Training Session",
    date: new Date(2025, 2, 25), // March 25, 2025
    startTime: "14:00",
    endTime: "17:00",
    type: "default",
  },
  {
    id: "17",
    title: "Board Meeting",
    date: new Date(2025, 2, 28), // March 28, 2025
    startTime: "15:00",
    endTime: "17:00",
    type: "info",
  },
  {
    id: "17",
    title: "Board Meeting",
    date: new Date(2025, 2, 28), // March 28, 2025
    startTime: "15:00",
    endTime: "17:00",
    type: "info",
  },
  {
    id: "17",
    title: "Board Meeting",
    date: new Date(2025, 2, 28), // March 28, 2025
    startTime: "15:00",
    endTime: "17:00",
    type: "info",
  },
  {
    id: "17",
    title: "Board Meeting",
    date: new Date(2025, 2, 28), // March 28, 2025
    startTime: "15:00",
    endTime: "17:00",
    type: "info",
  },
];

export const calendarAPI = {
  async fetchEvents(): Promise<CalendarEvent[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(sampleEvents);
      }, 500); // 500ms delay to simulate network request
    });
    // const response = await fetch('/api/calendar/events');
    // if (!response.ok) {
    //   throw new Error('Failed to fetch calendar events');
    // }
    // return response.json();
  },

  async createEvent(event: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> {
    const response = await fetch('/api/calendar/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });
    if (!response.ok) {
      throw new Error('Failed to create calendar event');
    }
    return response.json();
  },

  async updateEvent(event: CalendarEvent): Promise<CalendarEvent> {
    const response = await fetch(`/api/calendar/events/${event.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });
    if (!response.ok) {
      throw new Error('Failed to update calendar event');
    }
    return response.json();
  },

  async deleteEvent(eventId: string): Promise<void> {
    const response = await fetch(`/api/calendar/events/${eventId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete calendar event');
    }
  }
}; 