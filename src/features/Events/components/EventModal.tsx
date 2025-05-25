import { format } from "date-fns";
import { CalendarEvent } from "@/shared/types/events";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { EventDetailModal } from "./EventDetailModal";

interface EventModalProps {
  selectedDate: Date | null;
  selectedEvents: CalendarEvent[];
  onClose: () => void;
  getEventTypeClass: (event: CalendarEvent) => string;
}

export function EventModal({
  selectedDate,
  selectedEvents,
  onClose,
  getEventTypeClass,
}: EventModalProps) {
  const [selectedUserId, setSelectedUserId] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const handleClose = () => {
    setSelectedUserId('all');
    onClose();
  };

  // Group events by user_id
  const groupedEvents = selectedEvents.reduce((acc, event) => {
    const userId = event.userId || 'anonymous';
    if (!acc[userId]) {
      acc[userId] = {
        userFullName: event.userFullName || 'Anonymous',
        events: [],
      };
    }
    acc[userId].events.push(event);
    return acc;
  }, {} as Record<string, { userFullName: string; events: CalendarEvent[] }>);

  // Get events to display based on selection
  const displayEvents = selectedUserId === 'all'
    ? selectedEvents
    : groupedEvents[selectedUserId]?.events || [];

  return (
    <>
      <Dialog open={!!selectedDate} onOpenChange={handleClose}>
        <DialogContent className="max-w-[95vw] sm:max-w-[90vw] md:max-w-[800px] w-full max-h-[90vh] sm:max-h-[80vh] p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : ''}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-4 py-4 h-[calc(90vh-100px)] sm:h-[calc(80vh-100px)]">
            {/* Left side - User list */}
            <div className="border-b md:border-b-0 md:border-r pb-4 md:pb-0 pr-0 md:pr-4 overflow-y-auto">
              <h3 className="font-semibold mb-3 text-base sm:text-lg">Users</h3>
              <div className="flex md:block overflow-x-auto md:overflow-x-visible gap-2 md:gap-0 md:space-y-2">
                <button
                  onClick={() => setSelectedUserId('all')}
                  className={cn(
                    "whitespace-nowrap md:w-full text-left px-3 py-2 rounded-md transition-colors",
                    selectedUserId === 'all'
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  ทั้งหมด
                </button>
                {Object.entries(groupedEvents).map(([userId, { userFullName }]) => (
                  <button
                    key={userId}
                    onClick={() => setSelectedUserId(userId)}
                    className={cn(
                      "whitespace-nowrap md:w-full text-left px-3 py-2 rounded-md transition-colors",
                      selectedUserId === userId
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    )}
                  >
                    {userFullName}
                  </button>
                ))}
              </div>
            </div>

            {/* Right side - Events */}
            <div className="overflow-y-auto">
              {displayEvents.length === 0 ? (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No events found
                </div>
              ) : (
                <div className="space-y-4">
                  {displayEvents.map((event: CalendarEvent) => (
                    <div
                      key={event.id}
                      className={cn(
                        "p-3 sm:p-4 rounded-lg border cursor-pointer hover:shadow-md transition-shadow",
                        getEventTypeClass({ ...event })
                      )}
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="space-y-2">
                        {selectedUserId === 'all' && (
                          <div className="font-medium text-sm">
                            {event.userFullName || 'Anonymous'}
                          </div>
                        )}
                        <div className="text-sm font-semibold">
                          {event.subTypeName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {event.companyName}
                        </div>
                        {event.startTime && event.endTime && (
                          <div className="text-sm text-muted-foreground">
                            {event.startTime} - {event.endTime}
                          </div>
                        )}
                        {event.description && (
                          <div className="text-sm text-muted-foreground line-clamp-2">
                            {event.description}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <EventDetailModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </>
  );
} 