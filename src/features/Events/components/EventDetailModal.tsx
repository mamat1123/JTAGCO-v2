import { CalendarEvent } from "@/shared/types/events";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useEventDetail } from "../services/eventService";
import { useEventCheckins, useCreateEventCheckin } from "../services/eventCheckinService";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ImageGallery } from "@/shared/components/ImageGallery";
import { CheckCircle2, Clock, AlertCircle, Trash2 } from "lucide-react";
import { format, isValid } from "date-fns";
import { Button } from "@/shared/components/ui/button";
import { useState, useEffect, useMemo } from "react";
import { Textarea } from "@/shared/components/ui/textarea";
import { toast } from "sonner";
import { ImageUploader } from "@/shared/components/ImageUploader/ImageUploader";
import { cn } from "@/lib/utils";
import { Badge } from "@/shared/components/ui/badge";
import { useProfile } from "@/features/Profile/hooks/useProfile";
import { UserRole } from "@/shared/types/roles";
import { DeleteEventModal } from "./DeleteEventModal";

interface EventCheckin {
  id: number;
  event_id: number;
  detail: string;
  created_at: string;
  images?: string[];
}

interface EventDetailModalProps {
  event: CalendarEvent | null;
  onClose: () => void;
  onDelete: () => void;
}

export function EventDetailModal({ event, onClose, onDelete }: EventDetailModalProps) {
  const { data: eventDetail, isLoading, error: eventError } = useEventDetail(event?.id || null);
  const { data: checkins, refetch: refetchCheckins } = useEventCheckins(event?.id || null);
  const createCheckin = useCreateEventCheckin();
  const [checkinDetail, setCheckinDetail] = useState("");
  const [checkinImages, setCheckinImages] = useState<string[]>([]);
  const [showCheckinForm, setShowCheckinForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkinError, setCheckinError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { profile } = useProfile();

  const displayEvent = useMemo(() => {
    console.log("eventDetail", eventDetail);
    console.log("event", event);
    return eventDetail || event;
  }, [eventDetail, event]);

  useEffect(() => {
    console.log("displayEvent", displayEvent);
  }, [displayEvent]);

  // Reset states when modal closes
  useEffect(() => {
    if (!event) {
      setShowCheckinForm(false);
      setCheckinDetail("");
      setCheckinImages([]);
    }
  }, [event]);

  useEffect(() => {
    if (event?.id) {
      refetchCheckins();
    }
  }, [event?.id, refetchCheckins]);

  useEffect(() => {
    if (checkins) {
      setShowCheckinForm(checkins.length === 0);
    }
  }, [checkins]);

  const handleCheckin = async () => {
    if (!event?.id) return;
    if (!checkinDetail.trim()) {
      setCheckinError("กรุณากรอกรายละเอียดการเช็คอิน");
      return;
    }

    setIsSubmitting(true);
    setCheckinError(null);

    try {
      await createCheckin.mutateAsync({
        eventId: event.id,
        data: {
          detail: checkinDetail,
          images: checkinImages
        }
      });
      setCheckinDetail("");
      setCheckinImages([]);
      setShowCheckinForm(false);
      refetchCheckins();
      toast.success("เช็คอินสำเร็จ");
    } catch (error) {
      setCheckinError("ไม่สามารถเช็คอินได้ กรุณาลองใหม่อีกครั้ง");
      toast.error("ไม่สามารถเช็คอินได้");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (!isValid(date)) {
      return 'Invalid date';
    }
    return format(date, 'MMM d, yyyy h:mm a');
  };

  const isEventPassed = useMemo(() => {
    if (!displayEvent?.scheduled_at) return false;

    const eventDate = new Date(displayEvent.scheduled_at);
    eventDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return eventDate < today;
  }, [displayEvent]);

  const canCheckin = useMemo(() => {
    if (!profile || !displayEvent) return false;

    // Super admin can always check in
    if (profile.role === UserRole.SUPER_ADMIN) return true;
    if (profile.role === UserRole.MANAGER) return true;

    // Sales can only check in their own events
    if (profile.role === UserRole.SALES) {
      return profile.id === displayEvent.user_id;
    }

    return false;
  }, [profile, displayEvent]);

  const canDelete = useMemo(() => {
    if (!profile || !displayEvent) return false;

    // Super admin can always delete
    if (profile.role === UserRole.SUPER_ADMIN) return true;
    if (profile.role === UserRole.MANAGER) return true;

    // Sales can only delete their own events
    if (profile.role === UserRole.SALES) {
      return profile.id === displayEvent.user_id;
    }

    return false;
  }, [profile, displayEvent]);

  return (
    <>
      <Dialog open={!!event} onOpenChange={onClose}>
        <DialogContent className="max-w-[95vw] sm:max-w-[90vw] md:max-w-[600px] w-full p-4 sm:p-6 max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex flex-row mt-4 items-center justify-between">
            <DialogTitle className="text-lg sm:text-xl">Event Details</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto pr-2 -mr-2 flex-1">
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
            ) : eventError ? (
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
                    {displayEvent.subTypeName || displayEvent.mainTypeName}
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
                  <div className="flex items-center gap-2">
                    <Badge variant={isEventPassed ? "destructive" : "default"}>
                      {isEventPassed ? "Event Passed" : "Upcoming Event"}
                    </Badge>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-base sm:text-lg">Check-in</h4>
                      <div className="flex items-center gap-2">
                        {!showCheckinForm && !isEventPassed && canCheckin && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowCheckinForm(true)}
                          >
                            เช็คอิน
                          </Button>
                        )}
                        {canDelete && event?.id && !isEventPassed && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setShowDeleteModal(true)}
                            className="flex items-center gap-2"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="hidden sm:inline">ลบ</span>
                          </Button>
                        )}
                      </div>
                    </div>

                    {showCheckinForm && !isEventPassed && canCheckin && (
                      <div className="space-y-4">
                        {checkinError && (
                          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-600 border border-red-200">
                            <AlertCircle className="h-4 w-4 flex-shrink-0" />
                            <p className="text-sm">{checkinError}</p>
                          </div>
                        )}
                        <Textarea
                          placeholder="รายละเอียดการเช็คอิน"
                          value={checkinDetail}
                          onChange={(e) => {
                            setCheckinDetail(e.target.value);
                            setCheckinError(null);
                          }}
                          className={cn(
                            "min-h-[100px]",
                            checkinError && "border-red-500 focus-visible:ring-red-500"
                          )}
                        />
                        <ImageUploader
                          onImageUploaded={(urls) => setCheckinImages(urls)}
                          onImageRemoved={() => setCheckinImages([])}
                          maxSizeMB={5}
                          bucketName="events"
                          folderPath={`${event?.id}/checkins`}
                          multiple={true}
                          className="w-full"
                        />
                        <Button
                          className="w-full"
                          onClick={handleCheckin}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "กำลังเช็คอิน..." : "เช็คอิน"}
                        </Button>
                      </div>
                    )}

                    {isEventPassed && (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-50 text-yellow-600 border border-yellow-200">
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        <p className="text-sm">กิจกรรมนี้ได้ผ่านไปแล้ว ไม่สามารถเช็คอินได้</p>
                      </div>
                    )}

                    {!canCheckin && !isEventPassed && (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-50 text-yellow-600 border border-yellow-200">
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        <p className="text-sm">คุณไม่มีสิทธิ์ในการเช็คอินกิจกรรมนี้</p>
                      </div>
                    )}

                    {checkins && checkins.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2 text-base sm:text-lg">ประวัติการเช็คอิน</h4>
                        <div className="space-y-3">
                          {checkins.map((checkin: EventCheckin, index: number) => (
                            <div
                              key={checkin.id}
                              className="flex gap-3 p-3 rounded-lg bg-muted/50"
                            >
                              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <CheckCircle2 className="h-4 w-4 text-primary" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">เช็คอิน #{index + 1}</span>
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {formatDate(checkin.created_at)}
                                  </span>
                                </div>
                                <div className="mt-1 text-sm text-muted-foreground">
                                  {checkin.detail}
                                </div>
                                {checkin.images && checkin.images.length > 0 && (
                                  <div className="mt-2">
                                    <ImageGallery
                                      images={checkin.images}
                                      bucket="event-checkins"
                                      isPrivate={true}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  {displayEvent.eventImages && displayEvent.eventImages.length > 0 && (
                    <div className="pt-4">
                      <h4 className="font-medium mb-2 text-base sm:text-lg">Images</h4>
                      <ImageGallery images={displayEvent.eventImages} bucket="events" isPrivate={true} />
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>

      <DeleteEventModal
        isOpen={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        onDelete={onDelete}
      />
    </>
  );
} 