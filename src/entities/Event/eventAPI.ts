import { Event, CreateEventDto, UpdateEventDto, QueryEventParams } from './types';
import { api } from '@/shared/config/api';

export const eventAPI = {
  async createEvent(event: CreateEventDto): Promise<Event> {
    const { data } = await api.post('/events', event);
    return data;
  },

  async getEvents(params?: QueryEventParams): Promise<Event[]> {
    const { data } = await api.get('/events', { params });
    return data;
  },

  async getEvent(id: string): Promise<Event> {
    const { data } = await api.get(`/events/${id}`);
    return data;
  },

  async updateEvent(id: string, event: UpdateEventDto): Promise<Event> {
    const { data } = await api.patch(`/events/${id}`, event);
    return data;
  },

  async deleteEvent(id: string): Promise<void> {
    await api.delete(`/events/${id}`);
  },
}; 