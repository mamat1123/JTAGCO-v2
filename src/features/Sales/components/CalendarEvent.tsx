import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarProps, CalendarEvent } from "@/shared/types/calendar";

export function Calendar({ events = [], className }: CalendarProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date());

  // Get the current year and month
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Get the number of days in the current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Get the first day of the month (Sunday is 0, Monday is 1, etc.)
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  // No adjustment needed when Sunday is the first day of the week
  const startingDay = firstDayOfMonth;

  // Previous month's days to display
  const prevMonthDays = startingDay;

  // Calculate days from previous month
  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const daysInPrevMonth = new Date(prevMonthYear, prevMonth + 1, 0).getDate();

  // Next month
  const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
  const nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear;

  // Move to previous month
  const prevMonthHandler = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  // Move to next month
  const nextMonthHandler = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Format date to get month name
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  // Days of the week
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Filter events for the current month
  const getEventsForDay = (day: number): CalendarEvent[] => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === day &&
        eventDate.getMonth() === currentMonth &&
        eventDate.getFullYear() === currentYear;
    });
  };

  const getEventTypeClass = (type: "default" | "success" | "warning" | "error" | "info" | undefined = "default") => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "error":
        return "bg-red-100 text-red-800";
      case "info":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-purple-100 text-purple-800";
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">
          {monthName} {currentYear}
        </h2>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={prevMonthHandler}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextMonthHandler}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 text-center font-medium text-sm mb-2">
        {weekDays.map((day) => (
          <div key={day} className="py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {/* Previous month days */}
        {Array.from({ length: prevMonthDays }).map((_, index) => {
          const day = daysInPrevMonth - prevMonthDays + index + 1;
          return (
            <div
              key={`prev-${day}`}
              className="min-h-24 border rounded-md p-1 bg-muted/40 text-muted-foreground"
            >
              <div className="text-sm font-medium">{day}</div>
            </div>
          );
        })}

        {/* Current month days */}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const dayEvents = getEventsForDay(day);
          const hasMoreEvents = dayEvents.length > 2;

          return (
            <div
              key={`current-${day}`}
              className="min-h-24 border rounded-md p-1 bg-card"
            >
              <div className="text-sm font-medium">{day}</div>
              <div className="mt-1 space-y-1">
                {dayEvents.slice(0, 2).map((event) => (
                  <div
                    key={event.id}
                    className={cn(
                      "px-2 py-1 text-xs rounded-md",
                      getEventTypeClass(event.type)
                    )}
                  >
                    <div className="font-medium truncate">{event.title}</div>
                    {event.startTime && event.endTime && (
                      <div className="text-xs">{event.startTime} - {event.endTime}</div>
                    )}
                  </div>
                ))}
                {hasMoreEvents && (
                  <div className="text-xs text-right pr-1 text-muted-foreground">
                    +{dayEvents.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Next month days */}
        {Array.from({ length: 42 - (prevMonthDays + daysInMonth) }).map((_, index) => {
          const day = index + 1;
          return (
            <div
              key={`next-${day}`}
              className="min-h-24 border rounded-md p-1 bg-muted/40 text-muted-foreground"
            >
              <div className="text-sm font-medium">{day}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}