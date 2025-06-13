import { CalendarEvent } from "@/shared/types/events";
import { format, startOfMonth, endOfMonth, isToday } from "date-fns";
import { th } from "date-fns/locale";
import { useState, useRef } from "react";
import { useEvents } from "../services/eventService";
import { User, Building2, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { toast } from 'sonner';
import { EventDetailModal } from "./EventDetailModal";
import { EventFilter, EventFilters } from "./EventFilter";
import { EventStatus } from "@/shared/types/events";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { getEventTypeClass } from "@/shared/utils/eventUtils";
import { eventAPI } from "@/entities/Event/eventAPI";

export function EventsList() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const todayRef = useRef<HTMLDivElement>(null);
  const [filters, setFilters] = useState<EventFilters>({
    search: '',
    status: 'all',
    user_id: 'all',
    main_type_id: 'all',
    sub_type_id: 'all',
  });

  const scrollToToday = () => {
    setCurrentDate(new Date());

    // Check if today's date exists in the data
    const today = format(new Date(), 'yyyy-MM-dd');
    const hasToday = sortedDates.includes(today);

    if (!hasToday) {
      toast.error("ไม่พบข้อมูลของวันนี้ในรายการ");
      return;
    }

    if (todayRef.current) {
      todayRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      console.log('todayRef is null, cannot scroll');
    }
  };

  const { data: backendEvents = [], isLoading, error, refetch: refetchEvents } = useEvents({
    scheduled_at_start: startOfMonth(currentDate).toISOString(),
    scheduled_at_end: endOfMonth(currentDate).toISOString(),
    search: filters.search || undefined,
    status: filters.status !== 'all' ? filters.status as EventStatus : undefined,
    user_id: filters.user_id !== 'all' ? filters.user_id : undefined,
    main_type_id: filters.main_type_id !== 'all' ? filters.main_type_id : undefined,
    sub_type_id: filters.sub_type_id !== 'all' ? filters.sub_type_id : undefined
  });

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const handleFilterChange = (newFilters: EventFilters) => {
    setFilters(newFilters);
  };

  // Convert backend events to calendar events format
  const convertedBackendEvents: CalendarEvent[] = backendEvents.map(event => ({
    id: event.id,
    title: event.description || 'Untitled Event',
    date: format(new Date(event.scheduled_at), 'yyyy-MM-dd'),
    startTime: event.test_start_at ? format(new Date(event.test_start_at), 'HH:mm') : undefined,
    endTime: event.test_end_at ? format(new Date(event.test_end_at), 'HH:mm') : undefined,
    type: 'default',
    userFullName: event.userFullName,
    subTypeName: event.subTypeName,
    mainTypeName: event.mainTypeName,
    companyName: event.companyName,
    sub_type_id: event.sub_type_id,
    main_type_id: event.main_type_id
  }));

  // Combine local and backend events
  const allEvents = [...convertedBackendEvents];

  // Group events by date
  const groupedEvents = allEvents.reduce((groups, event) => {
    const date = format(event.date, "yyyy-MM-dd");
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(event);
    return groups;
  }, {} as Record<string, CalendarEvent[]>);

  // Sort events within each day by start time
  Object.keys(groupedEvents).forEach(date => {
    groupedEvents[date].sort((a, b) => {
      const timeA = a.startTime || '00:00';
      const timeB = b.startTime || '00:00';
      return timeA.localeCompare(timeB);
    });
  });

  // Sort dates in descending order (newest first)
  const sortedDates = Object.keys(groupedEvents).sort((a, b) => b.localeCompare(a));

  const onDeleteEvent = async () => {
    if (!selectedEvent?.id) {
      throw new Error("No event selected");
    }
    await eventAPI.deleteEvent(selectedEvent.id);
    await refetchEvents();
    setSelectedEvent(null);
  };

  return (
    <>
      <div className="space-y-6">
        <EventFilter onFilterChange={handleFilterChange} />
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-semibold">
            {currentDate.toLocaleString('th-TH', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={scrollToToday}
              className="h-9 px-3"
            >
              <Calendar className="h-4 w-4 mr-2" />
              วันนี้
            </Button>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentDate(new Date(currentYear, currentMonth - 1, 1))}
                className="h-9 w-9 sm:h-8 sm:w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentDate(new Date(currentYear, currentMonth + 1, 1))}
                className="h-9 w-9 sm:h-8 sm:w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {isLoading ? (
          // Skeleton loader for events
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="space-y-4">
              <Skeleton className="h-8 w-full" />
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, eventIndex) => (
                  <div key={eventIndex} className="p-4 rounded-lg border space-y-3">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-6 w-24" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : error ? (
          <div className="flex items-center justify-center p-8 text-red-500">
            Failed to load events. Please try again later.
          </div>
        ) : (
          sortedDates.map((date) => {
            const dayEvents = groupedEvents[date];
            const isCurrentDate = isToday(new Date(date));

            return (
              <div
                key={date}
                className="relative"
                ref={isCurrentDate ? todayRef : null}
              >
                <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm py-2 border-b">
                  <h3 className="text-lg font-semibold">
                    {format(new Date(date), "EEEE, d MMMM yyyy", { locale: th })}
                  </h3>
                </div>
                <div className="mt-2 space-y-2">
                  {dayEvents.map((event: CalendarEvent) => (
                    <div
                      key={`${date}-${event.id}`}
                      className={`flex flex-col cursor-pointer transition-all duration-300 hover:scale-101 p-4 rounded-lg border ${getEventTypeClass(event)}`}
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/50">
                          {event.subTypeName || event.mainTypeName}
                        </div>
                      </div>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          <span>{event.companyName || '-'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>{event.userFullName || '-'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
      <EventDetailModal
        event={selectedEvent}
        onDelete={onDeleteEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </>
  );
} 