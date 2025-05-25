import { useState, useEffect } from 'react';
import { eventAPI } from '@/entities/Event/eventAPI';
import { CreateEventDto, UpdateEventDto, QueryEventParams, Event } from '@/entities/Event/types';
import { toast } from 'sonner';

export const useEvents = (params?: QueryEventParams) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const data = await eventAPI.getEvents(params);
        setEvents(data);
      } catch (err) {
        setError(err as Error);
        toast.error('Failed to fetch events');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [params]);

  return { data: events, isLoading, error };
};

export const useEvent = (id: string) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const data = await eventAPI.getEvent(id);
        setEvent(data);
      } catch (err) {
        setError(err as Error);
        toast.error('Failed to fetch event');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  return { data: event, isLoading, error };
};

export const useCreateEvent = () => {
  const [isLoading, setIsLoading] = useState(false);

  const mutate = async (event: CreateEventDto) => {
    try {
      setIsLoading(true);
      await eventAPI.createEvent(event);
      toast.success('Event created successfully');
    } catch (err) {
      toast.error('Failed to create event');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutateAsync: mutate, isLoading };
};

export const useUpdateEvent = () => {
  const [isLoading, setIsLoading] = useState(false);

  const mutate = async ({ id, event }: { id: string; event: UpdateEventDto }) => {
    try {
      setIsLoading(true);
      await eventAPI.updateEvent(id, event);
      toast.success('Event updated successfully');
    } catch (err) {
      toast.error('Failed to update event');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutateAsync: mutate, isLoading };
};

export const useDeleteEvent = () => {
  const [isLoading, setIsLoading] = useState(false);

  const mutate = async (id: string) => {
    try {
      setIsLoading(true);
      await eventAPI.deleteEvent(id);
      toast.success('Event deleted successfully');
    } catch (err) {
      toast.error('Failed to delete event');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutateAsync: mutate, isLoading };
};