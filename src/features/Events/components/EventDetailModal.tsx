import { CalendarEvent } from "@/shared/types/events";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useEventDetail } from "../services/eventService";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ImageGallery } from "@/shared/components/ImageGallery";
import { CheckCircle2, Clock } from "lucide-react";
import { format } from "date-fns";

interface EventDetailModalProps {
  event: CalendarEvent | null;
  onClose: () => void;
}

export function EventDetailModal({ event, onClose }: EventDetailModalProps) {
  const { data: eventDetail, isLoading, error } = useEventDetail(event?.id || null);

  const displayEvent = eventDetail || event;

  return (
    <Dialog open={!!event} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-[90vw] md:max-w-[600px] w-full p-4 sm:p-6 max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Event Details</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto pr-2 -mr-2">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <div className="pt-4">
                <Skeleton className="h-6 w-1/3 mb-2" />
                <Skeleton className="h-20 w-full" />
              </div>
              <div className="pt-4">
                <Skeleton className="h-6 w-1/3 mb-2" />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="aspect-square w-full" />
                  ))}
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-4">
              Failed to load event details. Please try again.
            </div>
          ) : displayEvent ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="font-medium text-base sm:text-lg">
                  {displayEvent.userFullName || 'Anonymous'}
                </div>
                <div className="text-lg sm:text-xl font-semibold">
                  {displayEvent.subTypeName}
                </div>
                <div className="text-sm sm:text-base text-muted-foreground">
                  {displayEvent.companyName}
                </div>
                {displayEvent.startTime && displayEvent.endTime && (
                  <div className="text-sm sm:text-base text-muted-foreground">
                    {displayEvent.startTime} - {displayEvent.endTime}
                  </div>
                )}
                {displayEvent.description && (
                  <div className="pt-4">
                    <h4 className="font-medium mb-2 text-base sm:text-lg">Description</h4>
                    <p className="text-sm sm:text-base text-muted-foreground whitespace-pre-wrap">
                      {displayEvent.description}
                    </p>
                  </div>
                )}
                {displayEvent.eventCheckins && displayEvent.eventCheckins.length > 0 && (
                  <div className="pt-4">
                    <h4 className="font-medium mb-2 text-base sm:text-lg">Check-ins</h4>
                    <div className="space-y-3">
                      {displayEvent.eventCheckins.map((checkin, index) => (
                        <div 
                          key={index}
                          className="flex gap-3 p-3 rounded-lg bg-muted/50"
                        >
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">Check-in #{index + 1}</span>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {format(new Date(checkin.created_at), 'MMM d, yyyy h:mm a')}
                              </span>
                            </div>
                            <div className="mt-1 text-sm text-muted-foreground">
                              {checkin.detail}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {displayEvent.eventImages && displayEvent.eventImages.length > 0 && (
                  <div className="pt-4">
                    <h4 className="font-medium mb-2 text-base sm:text-lg">Images</h4>
                    <ImageGallery images={displayEvent.eventImages} />
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
} 