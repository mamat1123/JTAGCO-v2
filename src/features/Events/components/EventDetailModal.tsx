import { CalendarEvent } from "@/shared/types/events";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useEventDetail, useReceiveShoeVariants } from "../services/eventService";
import { useEventCheckins, useCreateEventCheckin } from "../services/eventCheckinService";
import { useEventTimeline, EventTimelineStep } from "../services/eventTimelineService";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { ImageGallery } from "@/shared/components/ImageGallery";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Trash2,
  User,
  Building2,
  Camera,
  Plus,
  X,
  MapPin,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  Contact,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useState, useEffect, useMemo } from "react";
import { Textarea } from "@/shared/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { TrackingTimeline } from "./TrackingTimeline";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shared/components/ui/collapsible";
import { useProfile } from "@/features/Profile/hooks/useProfile";
import { UserRole } from "@/shared/types/roles";
import { DeleteEventModal } from "./DeleteEventModal";
import { ImageUploader } from "@/shared/components/ImageUploader";
import { formatThaiDate } from "@/shared/utils/dateUtils";

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
  onDelete: () => Promise<void>;
}

export function EventDetailModal({ event, onClose, onDelete }: EventDetailModalProps) {
  const { data: eventDetail, isLoading, error: eventError } = useEventDetail(event?.id || null);
  const { data: checkins, refetch: refetchCheckins } = useEventCheckins(event?.id || null);
  const { data: timelineSteps, isLoading: isLoadingTimeline } = useEventTimeline(event?.id || null);
  const createCheckin = useCreateEventCheckin();
  const receiveShoeVariants = useReceiveShoeVariants();
  const [checkinDetail, setCheckinDetail] = useState("");
  const [checkinImages, setCheckinImages] = useState<string[]>([]);
  const [showCheckinForm, setShowCheckinForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkinError, setCheckinError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const { profile } = useProfile();

  const displayEvent = useMemo(() => {
    return eventDetail || event;
  }, [eventDetail, event]);

  // Reset states when modal closes
  useEffect(() => {
    if (!event) {
      setShowCheckinForm(false);
      setCheckinDetail("");
      setCheckinImages([]);
      setIsTrackingOpen(false);
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

  const onReceiveProduct = async () => {
    if (!event?.id) return;
    
    try {
      await receiveShoeVariants.mutateAsync(event.id);
      toast.success("รับสินค้าสำเร็จ");
    } catch (error) {
      toast.error("ไม่สามารถรับสินค้าได้ กรุณาลองใหม่อีกครั้ง");
    }
  }

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

  // Update the tracking steps type
  const trackingSteps = useMemo(() => {
    if (!timelineSteps) return [];
    return timelineSteps;
  }, [timelineSteps]);

  return (
    <>
      <Dialog open={!!event} onOpenChange={(open) => {
        if (!open && !showDeleteModal) {
          onClose();
        }
      }}>
        <DialogContent className="!max-w-4xl w-[95vw] max-h-[90vh] p-0 overflow-hidden flex flex-col">
          <div className="flex flex-col h-full max-h-[90vh]">
            {/* Header */}
            <DialogHeader className="p-4 md:px-6 md:py-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-base md:text-2xl font-bold text-gray-900">รายละเอียดกิจกรรม</DialogTitle>
              </div>
            </DialogHeader>

            {/* Content */}
            <div className="flex-1 overflow-y-auto pb-6">
              {isLoading ? (
                <div className="md:p-6 p-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <Skeleton className="h-8 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-20 w-full" />
                    </CardContent>
                  </Card>
                </div>
              ) : eventError ? (
                <div className="md:p-6 p-2 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <AlertCircle className="h-12 w-12 text-red-500" />
                    <div className="text-red-600">
                      <h3 className="font-semibold">ไม่สามารถโหลดรายละเอียดกิจกรรม</h3>
                      <p className="text-sm">กรุณาลองใหม่อีกครั้ง</p>
                    </div>
                  </div>
                </div>
              ) : displayEvent ? (
                <div className="md:p-6 p-2 space-y-6">
                  {/* Event Info Card */}
                  <Card className="overflow-hidden p-0 mb-4">
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 py-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <CardTitle className="text-lg md:text-2xl text-gray-900">
                            {displayEvent.subTypeName || displayEvent.mainTypeName}
                          </CardTitle>
                          <Badge variant={isEventPassed ? "destructive" : "default"} className="w-fit text-xs md:text-sm">
                            {isEventPassed ? "กิจกรรมที่ผ่านมาแล้ว" : "กิจกรรมที่กำลังจะมาถึง"}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="md:p-6 p-2">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <User className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-xs md:text-sm text-gray-500">ผู้จัด</p>
                              <p className="text-sm md:font-medium">{displayEvent.userFullName || "Anonymous"}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <Building2 className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="text-xs md:text-sm text-gray-500">บริษัท</p>
                              <p className="text-sm md:font-medium">{displayEvent.companyName}</p>
                            </div>
                          </div>

                          {/* Customer Information */}
                          {displayEvent.customers && (
                            <>
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                  <Contact className="h-4 w-4 md:h-5 md:w-5 text-orange-600" />
                                </div>
                                <div>
                                  <p className="text-xs md:text-sm text-gray-500">ผู้ติดต่อ</p>
                                  <p className="text-sm md:font-medium">{displayEvent.customers.contact_name}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                  <Mail className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                                </div>
                                <div>
                                  <p className="text-xs md:text-sm text-gray-500">อีเมล</p>
                                  <p className="text-sm md:font-medium">{displayEvent.customers.email}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                  <Phone className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
                                </div>
                                <div>
                                  <p className="text-xs md:text-sm text-gray-500">เบอร์โทรศัพท์</p>
                                  <p className="text-sm md:font-medium">{displayEvent.customers.phone}</p>
                                </div>
                              </div>
                            </>
                          )}

                          {displayEvent.startTime && displayEvent.endTime && (
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-purple-100 rounded-lg">
                                <Clock className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
                              </div>
                              <div>
                                <p className="text-xs md:text-sm text-gray-500">เวลา</p>
                                <p className="text-sm md:font-medium">
                                  {displayEvent.startTime} - {displayEvent.endTime}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {displayEvent.description && (
                          <div className="space-y-2">
                            <h4 className="font-semibold text-gray-900 text-sm md:text-base">รายละเอียด</h4>
                            <div className="p-4 bg-gray-50 rounded-lg">
                              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm md:text-base">
                                {displayEvent.description}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Event Images */}
                  {displayEvent.eventImages && displayEvent.eventImages.length > 0 && (
                    <Card className="overflow-hidden p-2 pt-4 md:p-6 mb-4 flex gap-2ode">
                      <CardHeader className="p-0">
                        <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                          <Camera className="h-4 w-4 md:h-5 md:w-5" />
                          รูปภาพกิจกรรม
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="md:p-6 p-2">
                        <ImageGallery images={displayEvent.eventImages} bucket="events" isPrivate={true} />
                      </CardContent>
                    </Card>
                  )}

                  {/* Check-in Section */}
                  <Card className="mb-4 py-2 md:py-6">
                    <CardHeader className="p-2 md:p-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                          <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5" />
                          จัดการการเช็คอิน
                        </CardTitle>
                        {!showCheckinForm && canCheckin && (
                          <Button onClick={() => setShowCheckinForm(true)} className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            เช็คอิน
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 px-2 md:px-6">
                      {/* Check-in Form */}
                      {showCheckinForm && canCheckin && (
                        <div className="p-4 border-2 border-dashed border-gray-200 rounded-lg space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm md:text-base">เช็คอินใหม่</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setShowCheckinForm(false);
                                setCheckinError(null);
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>

                          {checkinError && (
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-600 border border-red-200">
                              <AlertCircle className="h-4 w-4 flex-shrink-0" />
                              <p className="text-xs md:text-sm">{checkinError}</p>
                            </div>
                          )}

                          <Textarea
                            placeholder="รายละเอียดการเช็คอิน..."
                            value={checkinDetail}
                            onChange={(e) => {
                              setCheckinDetail(e.target.value);
                              setCheckinError(null);
                            }}
                            className={cn("min-h-[100px]", checkinError && "border-red-500 focus-visible:ring-red-500")}
                          />

                          <ImageUploader
                            onImageUploaded={(urls) => setCheckinImages(urls)}
                            onImageRemoved={() => setCheckinImages([])}
                            multiple={true}
                            bucketName="events"
                            folderPath={`${event?.id}/checkins`}
                            className="w-full"
                          />

                          <Button className="w-full" onClick={handleCheckin} disabled={isSubmitting}>
                            {isSubmitting ? "กำลังเช็คอิน..." : "บันทึกการเช็คอิน"}
                          </Button>
                        </div>
                      )}

                      {/* Status Messages */}
                      {isEventPassed && (
                        <div className="flex items-center gap-2 p-4 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
                          <AlertCircle className="h-5 w-5 flex-shrink-0" />
                          <div>
                            <p className="font-medium">กิจกรรมสิ้นสุดแล้ว</p>
                            <p className="text-xs md:text-sm">ไม่สามารถเช็คอินได้เนื่องจากกิจกรรมสิ้นสุดแล้ว</p>
                          </div>
                        </div>
                      )}

                      {!canCheckin && !isEventPassed && (
                        <div className="flex items-center gap-2 p-4 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                          <AlertCircle className="h-5 w-5 flex-shrink-0" />
                          <div>
                            <p className="font-medium">ไม่มีสิทธิ์เข้าถึง</p>
                            <p className="text-xs md:text-sm">คุณไม่มีสิทธิ์ในการเช็คอินกิจกรรมนี้</p>
                          </div>
                        </div>
                      )}

                      {/* Check-in History */}
                      {checkins && checkins.length > 0 && (
                        <div className="space-y-4">
                          <Separator />
                          <h4 className="font-semibold text-lg text-sm md:text-lg">ประวัติการเช็คอิน</h4>
                          <div className="space-y-3">
                            {checkins.map((checkin: EventCheckin, index: number) => (
                              <div
                                key={checkin.id}
                                className="p-4 rounded-lg border bg-gradient-to-r from-green-50 to-emerald-50"
                              >
                                <div className="flex gap-4">
                                  <div className="flex-shrink-0">
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                                    </div>
                                  </div>
                                  <div className="flex-1 space-y-2">
                                    <div className="flex md:flex-row flex-col items-start md:items-center justify-between">
                                      <span className="font-medium text-green-800 text-sm md:text-base">เช็คอิน #{index + 1}</span>
                                      <span className="text-xs md:text-sm text-green-600 flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {formatThaiDate(checkin.created_at)}
                                      </span>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed text-sm md:text-base">{checkin.detail}</p>
                                    {checkin.images && checkin.images.length > 0 && (
                                      <div className="pt-2">
                                        <ImageGallery
                                          images={checkin.images}
                                          bucket="event-checkins"
                                          isPrivate={true}
                                        />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {(!checkins || checkins.length === 0) && !isEventPassed && (
                        <div className="text-center py-8 text-gray-500">
                          <CheckCircle2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                          <p className="font-medium text-sm md:text-base">ยังไม่มีการเช็คอิน</p>
                          <p className="text-xs md:text-sm">ประวัติการเช็คอินจะแสดงที่นี่เมื่อมีการเช็คอิน</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>


                  {/* Event Tracking Collapsible Card */}
                  {
                    trackingSteps.length > 0 && (
                      <Collapsible open={isTrackingOpen} onOpenChange={setIsTrackingOpen}>
                        <Card className="overflow-hidden border-blue-100 shadow-sm py-4">
                          <CollapsibleTrigger asChild>
                            <CardContent className="cursor-pointer hover:bg-blue-50/50 transition-colors">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-blue-100 rounded-lg">
                                    <MapPin className="h-5 w-5 text-blue-600" />
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-blue-800 text-sm md:text-base">สถานะเบิกสินค้า</h3>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {isLoadingTimeline ? (
                                    <Skeleton className="h-6 w-24" />
                                  ) : (
                                    <Badge variant="outline" className="text-blue-600 border-blue-200 text-xs md:text-sm">
                                      {trackingSteps.filter((step: EventTimelineStep) => step.status === "completed").length}/
                                      {trackingSteps.length} เสร็จสิ้น
                                    </Badge>
                                  )}
                                  {isTrackingOpen ? (
                                    <ChevronUp className="h-5 w-5 text-blue-600" />
                                  ) : (
                                    <ChevronDown className="h-5 w-5 text-blue-600" />
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div className="border-t border-blue-100">
                              <CardContent className="p-6 bg-blue-50/30">
                                {isLoadingTimeline ? (
                                  <div className="space-y-4">
                                    <Skeleton className="h-12 w-full" />
                                    <Skeleton className="h-12 w-full" />
                                    <Skeleton className="h-12 w-full" />
                                  </div>
                                ) : (
                                  <TrackingTimeline steps={trackingSteps} onReceiveProduct={onReceiveProduct} />
                                )}
                              </CardContent>
                            </div>
                          </CollapsibleContent>
                        </Card>
                      </Collapsible>
                    )
                  }

                  <div className="flex items-center justify-center gap-2">
                    {canDelete && (
                      <Button
                        variant="destructive"
                        size="lg"
                        onClick={() => setShowDeleteModal(true)}
                        className="flex items-center gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        ลบ
                      </Button>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
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