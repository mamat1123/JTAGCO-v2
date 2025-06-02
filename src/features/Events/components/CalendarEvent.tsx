import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarProps, CalendarEvent, EventStatus } from "@/shared/types/events";
import { useEvents } from "../services/eventService";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { startOfMonth, endOfMonth } from "date-fns";
import { EventModal } from "./EventModal";
import { EventFilter } from "./EventFilter";

const WEEK_DAYS = [
  { key: 'sun', label: 'S' },
  { key: 'mon', label: 'M' },
  { key: 'tue', label: 'T' },
  { key: 'wed', label: 'W' },
  { key: 'thu', label: 'T' },
  { key: 'fri', label: 'F' },
  { key: 'sat', label: 'S' }
] as const;

const getEventTypeClass = (event: CalendarEvent) => {
  const {sub_type_id } = event;
  if (sub_type_id === 10) {
    return "bg-rose-100 text-rose-800";
  } else if (sub_type_id === 6) {
    return "bg-red-200 text-red-900";
  }
  return 'bg-orange-100 text-orange-800';
};

const DayCell: React.FC<{
  day: number;
  isCurrentMonth: boolean;
  events: CalendarEvent[];
  isLoading: boolean;
  onDateClick: (day: number, isCurrentMonth: boolean) => void;
}> = ({ day, isCurrentMonth, events, isLoading, onDateClick }) => {
  const hasMoreEvents = events.length > 2;

  return (
    <div
      className={cn(
        "min-h-[80px] sm:min-h-24 border rounded-md p-1 cursor-pointer hover:bg-muted/50 transition-colors",
        isCurrentMonth ? "bg-card" : "bg-muted/40 text-muted-foreground"
      )}
      onClick={() => onDateClick(day, isCurrentMonth)}
    >
      <div className="text-sm font-medium">{day}</div>
      {isCurrentMonth && (
        <div className="mt-1 space-y-1">
          {isLoading ? (
            Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))
          ) : (
            <>
              {events.slice(0, 2).map((event) => (
                <div
                  key={event.id}
                  className={cn(
                    "px-1.5 sm:px-2 py-1 sm:py-1.5 text-[9px] sm:text-xs rounded-md hover:bg-opacity-90 transition-colors",
                    getEventTypeClass({ ...event })
                  )}
                >
                  <div className="flex flex-col gap-0.5">
                    <div className="font-medium truncate leading-tight">
                      {event.userFullName || 'Anonymous'}
                    </div>
                    <div className="font-semibold text-primary truncate">
                      {event.subTypeName}
                    </div>
                    <div className="text-muted-foreground truncate">
                      {event.companyName}
                    </div>
                  </div>
                </div>
              ))}
              {hasMoreEvents && (
                <div className="text-[9px] sm:text-xs text-right pr-1 text-muted-foreground">
                  +{events.length - 2} more
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export function Calendar({ className }: Omit<CalendarProps, "events">) {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [selectedEvents, setSelectedEvents] = React.useState<CalendarEvent[]>([]);
  const [filters, setFilters] = React.useState({
    search: '',
    status: 'all',
    user_id: 'all',
    main_type_id: 'all',
    sub_type_id: 'all'
  });

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const { data: backendEvents = [], isLoading } = useEvents({
    scheduled_at_start: startOfMonth(currentDate).toISOString(),
    scheduled_at_end: endOfMonth(currentDate).toISOString(),
    search: filters.search || undefined,
    status: filters.status !== 'all' ? filters.status as EventStatus : undefined,
    user_id: filters.user_id !== 'all' ? filters.user_id : undefined,
    main_type_id: filters.main_type_id !== 'all' ? filters.main_type_id : undefined,
    sub_type_id: filters.sub_type_id !== 'all' ? filters.sub_type_id : undefined
  });

  const events: CalendarEvent[] = React.useMemo(() =>
    backendEvents.map((event) => ({
      id: event.id,
      userId: event.user_id,
      title: event.description,
      date: event.scheduled_at,
      startTime: event.test_start_at || undefined,
      endTime: event.test_end_at || undefined,
      type: event.status === 'completed' ? 'success' : 'default',
      description: event.description,
      company_id: event.company_id,
      subTypeName: event.subTypeName,
      companyName: event.companyName,
      userFullName: event.userFullName,
      main_type_id: event.main_type_id,
      sub_type_id: event.sub_type_id,
    })), [backendEvents]);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const prevMonthDays = firstDayOfMonth;

  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const daysInPrevMonth = new Date(prevMonthYear, prevMonth + 1, 0).getDate();

  const getEventsForDay = React.useCallback((day: number): CalendarEvent[] => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === day &&
        eventDate.getMonth() === currentMonth &&
        eventDate.getFullYear() === currentYear;
    });
  }, [events, currentMonth, currentYear]);

  const handleDateClick = React.useCallback((day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return;

    const date = new Date(currentYear, currentMonth, day);
    setSelectedDate(date);
    setSelectedEvents(getEventsForDay(day));
  }, [currentYear, currentMonth, getEventsForDay]);

  const renderDayCell = React.useCallback((day: number, isCurrentMonth: boolean = true) => {
    const dayEvents = isCurrentMonth ? getEventsForDay(day) : [];
    return (
      <DayCell
        key={`${isCurrentMonth ? 'current' : 'other'}-${day}`}
        day={day}
        isCurrentMonth={isCurrentMonth}
        events={dayEvents}
        isLoading={isLoading}
        onDateClick={handleDateClick}
      />
    );
  }, [getEventsForDay, isLoading, handleDateClick]);

  return (
    <div className={cn("w-full", className)}>
      <EventFilter onFilterChange={handleFilterChange} />
      <div className="flex items-center justify-between my-4">
        <h2 className="text-lg sm:text-xl font-semibold">
          {currentDate.toLocaleString('th-TH', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex gap-2">
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

      <div className="grid grid-cols-7 text-center font-medium text-xs sm:text-sm mb-2">
        {WEEK_DAYS.map((day) => (
          <div key={day.key} className="py-1 sm:py-2">
            {day.label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
        {/* Previous month days */}
        {Array.from({ length: prevMonthDays }).map((_, index) => {
          const day = daysInPrevMonth - prevMonthDays + index + 1;
          return renderDayCell(day, false);
        })}

        {/* Current month days */}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          return renderDayCell(day, true);
        })}

        {/* Next month days */}
        {Array.from({ length: 42 - (prevMonthDays + daysInMonth) }).map((_, index) => {
          const day = index + 1;
          return renderDayCell(day, false);
        })}
      </div>

      <EventModal
        selectedDate={selectedDate}
        selectedEvents={selectedEvents}
        onClose={() => setSelectedDate(null)}
        getEventTypeClass={getEventTypeClass}
      />
    </div>
  );
}