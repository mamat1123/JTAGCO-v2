import { CalendarEvent } from "@/shared/types/events";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useEventDetail, useReceiveShoeVariants } from "../services/eventService";
import { useEventCheckins, useCreateEventCheckin } from "../services/eventCheckinService";
import { useEventTimeline } from "../services/eventTimelineService";
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
  Mail,
  Phone,
  Contact,
  Tag,
  DollarSign,
  Briefcase,
  Package,
  Calendar,
  FileText,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useState, useEffect, useMemo } from "react";
import { Textarea } from "@/shared/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { DeliveryTracking } from "./DeliveryTracking";
import { useProfile } from "@/features/Profile/hooks/useProfile";
import { UserRole } from "@/shared/types/roles";
import { DeleteEventModal } from "./DeleteEventModal";
import { ImageUploader } from "@/shared/components/ImageUploader";
import { formatThaiDate } from "@/shared/utils/dateUtils";
import { MONTHS, PROBLEM_TYPES, SUB_TYPE_CODES, SUB_TYPE_THAI_NAMES } from "@/shared/constants/eventSubTypes";
import { PresentCheckinFields } from "./PresentCheckinFields";
import { TestResultFields } from "./ConditionalFields/TestResultFields";
import { ProblemTypeField } from "./ConditionalFields/ProblemTypeField";
import { ProductSelection } from "@/entities/Event/types";
import { ProductType } from "@/entities/Product/product";
import { useProducts } from "@/features/Settings/Products/hooks/useProducts";

interface EventCheckin {
  id: number;
  event_id: number;
  detail: string;
  created_at: string;
  images?: string[];
  // PRESENT check-in fields
  product_selections?: ProductSelection[];
  delivery_duration?: string;
  purchase_type?: 'monthly' | 'yearly';
  purchase_months?: string[];
  competitor_brand?: string;
  special_requirements?: string;
  // TEST_RESULT check-in fields
  test_result?: string;
  test_result_reason?: string;
  got_job?: string;
  got_job_reason?: string;
  // FOUND_PROBLEM check-in fields
  problem_types?: string[];
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
  const { data: products = [] } = useProducts();
  const [checkinDetail, setCheckinDetail] = useState("");
  const [checkinImages, setCheckinImages] = useState<string[]>([]);
  const [showCheckinForm, setShowCheckinForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkinError, setCheckinError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [checkinFormSubmitted, setCheckinFormSubmitted] = useState(false);

  // PRESENT check-in fields
  const [productSelections, setProductSelections] = useState<ProductSelection[]>([]);
  const [deliveryDuration, setDeliveryDuration] = useState("");
  const [purchaseType, setPurchaseType] = useState<'monthly' | 'yearly'>();
  const [purchaseMonths, setPurchaseMonths] = useState<string[]>([]);
  const [competitorBrand, setCompetitorBrand] = useState("");
  const [specialRequirements, setSpecialRequirements] = useState("");

  // TEST_RESULT check-in fields
  const [testResult, setTestResult] = useState("");
  const [testResultReason, setTestResultReason] = useState("");
  const [gotJob, setGotJob] = useState("");
  const [gotJobReason, setGotJobReason] = useState("");

  // FOUND_PROBLEM check-in fields
  const [problemTypes, setProblemTypes] = useState<string[]>([]);

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
    
    setCheckinFormSubmitted(true);
    
    // Validate detail only for FOUND_PROBLEM
    if (requireCheckinDetail && !checkinDetail.trim()) {
      setCheckinError("กรุณากรอกรายละเอียดการเช็คอิน");
      return;
    }

    // Validate images for specific sub types
    if (requireCheckinImages && checkinImages.length === 0) {
      setCheckinError("กรุณาอัปโหลดรูปภาพอย่างน้อย 1 รูป");
      return;
    }

    // Validate problem types for FOUND_PROBLEM
    if (requireProblemType && problemTypes.length === 0) {
      setCheckinError("กรุณาเลือกประเภทปัญหาอย่างน้อย 1 รายการ");
      return;
    }

    // Validate PRESENT check-in fields if applicable
    // Note: PRESENT field errors are shown by PresentCheckinFields component, not here
    if (showPresentCheckinFields && !validatePresentCheckinFields.isValid) {
      return;
    }

    // Validate TEST_RESULT check-in fields if applicable
    if (showTestResultCheckinFields) {
      const validation = validateTestResultCheckinFields;
      if (!validation.isValid) {
        setCheckinError(validation.errors[0]);
        return;
      }
    }

    setIsSubmitting(true);
    setCheckinError(null);

    try {
      const checkinData: Record<string, unknown> = {
        detail: checkinDetail,
        images: checkinImages
      };

      // Add PRESENT check-in fields if applicable
      if (showPresentCheckinFields) {
        checkinData.product_selections = productSelections;
        checkinData.delivery_duration = deliveryDuration;
        checkinData.purchase_type = purchaseType;
        checkinData.purchase_months = purchaseMonths;
        checkinData.competitor_brand = competitorBrand;
      }

      // Add TEST_RESULT check-in fields if applicable
      if (showTestResultCheckinFields) {
        checkinData.test_result = testResult;
        checkinData.test_result_reason = testResultReason;
        checkinData.got_job = gotJob;
        checkinData.got_job_reason = gotJobReason;
      }

      // Add FOUND_PROBLEM check-in fields if applicable
      if (requireProblemType) {
        checkinData.problem_types = problemTypes;
      }


      await createCheckin.mutateAsync({
        eventId: event.id,
        data: checkinData
      });
      
      // Reset form
      setCheckinDetail("");
      setCheckinImages([]);
      setProductSelections([]);
      setDeliveryDuration("");
      setPurchaseType(undefined);
      setPurchaseMonths([]);
      setCompetitorBrand("");
      // Reset TEST_RESULT fields
      setTestResult("");
      setTestResultReason("");
      setGotJob("");
      setGotJobReason("");
      // Reset FOUND_PROBLEM fields
      setProblemTypes([]);
      setCheckinFormSubmitted(false);
      setShowCheckinForm(false);
      refetchCheckins();
      toast.success("เช็คอินสำเร็จ");
    } catch {
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
    } catch {
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
    if (profile.role === UserRole.SALES && !isEventPassed) {
      return profile.id === displayEvent.user_id;
    }

    return false;
  }, [profile, displayEvent, isEventPassed]);

  useEffect(() => {
    console.log(profile);
  }, [canCheckin, profile]);


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

  // Get sub type code from subTypeName
  const subTypeCode = useMemo(() => {
    if (!displayEvent?.subTypeName) return '';
    return SUB_TYPE_THAI_NAMES[displayEvent.subTypeName] || '';
  }, [displayEvent?.subTypeName]);

  // Check-in validation flags based on sub type
  const requireCheckinImages = useMemo(() => {
    return ([
      SUB_TYPE_CODES.SHIPPING,
      SUB_TYPE_CODES.BILLING,
      SUB_TYPE_CODES.ACCEPTING_CHEQUE,
      SUB_TYPE_CODES.SENT_TEST,
      SUB_TYPE_CODES.CHANGE_SIZE,
      SUB_TYPE_CODES.MEASURE,
      SUB_TYPE_CODES.EXHIBIT_BOOTHS,
      SUB_TYPE_CODES.FOUND_PROBLEM,
      SUB_TYPE_CODES.OTHER,
      SUB_TYPE_CODES.TEST_RESULT,
    ] as string[]).includes(subTypeCode);
  }, [subTypeCode]);

  const requireCheckinDetail = useMemo(() => {
    return ([
      SUB_TYPE_CODES.FOUND_PROBLEM,
    ] as string[]).includes(subTypeCode);
  }, [subTypeCode]);

  const requireProblemType = useMemo(() => {
    return subTypeCode === SUB_TYPE_CODES.FOUND_PROBLEM;
  }, [subTypeCode]);

  // Check if selected main type is FIRST_VISIT (เข้าพบครั้งแรก)
  const isFirstVisitMainType = useMemo(() => {
    return displayEvent?.mainTypeName?.includes('เข้าพบครั้งแรก') || false;
  }, [displayEvent?.mainTypeName]);

  // Conditional field visibility flags
  const showSalesBeforeVat = useMemo(() => {
    return ([SUB_TYPE_CODES.PO_NEW, SUB_TYPE_CODES.PO_OLD] as string[]).includes(subTypeCode);
  }, [subTypeCode]);

  const showCallNewFields = useMemo(() => {
    return ([SUB_TYPE_CODES.CALL_NEW_1, SUB_TYPE_CODES.CALL_NEW_2] as string[]).includes(subTypeCode);
  }, [subTypeCode]);

  const showTestResultFields = useMemo(() => {
    return subTypeCode === SUB_TYPE_CODES.TEST_RESULT;
  }, [subTypeCode]);

  const showProblemTypeField = useMemo(() => {
    return subTypeCode === SUB_TYPE_CODES.FOUND_PROBLEM;
  }, [subTypeCode]);

  const showPresentTimeField = useMemo(() => {
    return subTypeCode === SUB_TYPE_CODES.PRESENT;
  }, [subTypeCode]);

  // Show time picker for PRESENT sub type OR FIRST_VISIT main type
  const showTimePicker = useMemo(() => {
    return showPresentTimeField || isFirstVisitMainType;
  }, [showPresentTimeField, isFirstVisitMainType]);

  // Show PRESENT check-in fields for PRESENT sub_type OR FIRST_VISIT main_type
  const showPresentCheckinFields = useMemo(() => {
    return showPresentTimeField || isFirstVisitMainType;
  }, [showPresentTimeField, isFirstVisitMainType]);

  // Show TEST_RESULT check-in fields for TEST_RESULT sub_type
  const showTestResultCheckinFields = useMemo(() => {
    return subTypeCode === SUB_TYPE_CODES.TEST_RESULT;
  }, [subTypeCode]);

  // Check if conditional fields section should be shown
  const showConditionalFieldsSection = useMemo(() => {
    const hasSalesBeforeVat = showSalesBeforeVat && displayEvent?.sales_before_vat;
    const hasCallNewFields = showCallNewFields && !!(displayEvent?.business_type || displayEvent?.shoe_order_quantity ||
      displayEvent?.has_appointment !== undefined || displayEvent?.purchase_months?.length);
    const hasTestResultFields = showTestResultFields && !!(displayEvent?.test_result || displayEvent?.got_job);
    const hasProblemTypeField = showProblemTypeField && displayEvent?.problem_types?.length;
    const hasPresentTimeField = showTimePicker && displayEvent?.present_time;
    
    return hasSalesBeforeVat || hasCallNewFields || hasTestResultFields || hasProblemTypeField || hasPresentTimeField;
  }, [showSalesBeforeVat, showCallNewFields, showTestResultFields, showProblemTypeField, showTimePicker, displayEvent]);

  // Validate PRESENT check-in fields
  const validatePresentCheckinFields = useMemo(() => {
    if (!showPresentCheckinFields) return { isValid: true, errors: [] };

    const errors: string[] = [];

    // Check images for PRESENT check-in
    if (!checkinImages || checkinImages.length === 0) {
      errors.push("กรุณาอัปโหลดรูปภาพอย่างน้อย 1 รูป");
    }

    // Check product selections
    if (productSelections.length === 0) {
      errors.push("กรุณาเพิ่มสินค้าอย่างน้อย 1 รายการ");
    } else {
      // Check for shoe and insole
      const hasShoe = productSelections.some((item) => {
        const product = products.find((p) => p.id === item.product_id);
        return product?.type === ProductType.SHOE;
      });

      const hasInsole = productSelections.some((item) => {
        const product = products.find((p) => p.id === item.product_id);
        return product?.type === ProductType.INSOLE;
      });

      if (!hasShoe || !hasInsole) {
        errors.push("กรุณาเลือกรองเท้าและแผ่นรองใน");
      }
    }

    if (!deliveryDuration) {
      errors.push("กรุณาเลือกระยะเวลาจัดส่ง");
    }

    if (!purchaseType) {
      errors.push("กรุณาเลือกประเภทรอบซื้อ");
    }

    if (purchaseMonths.length === 0) {
      errors.push("กรุณาเลือกรอบซื้ออย่างน้อย 1 เดือน");
    }

    if (!competitorBrand.trim()) {
      errors.push("กรุณากรอกแบรนด์คู่แข่ง");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }, [showPresentCheckinFields, productSelections, deliveryDuration, purchaseType, purchaseMonths, competitorBrand, products, checkinImages]);

  // Validate TEST_RESULT check-in fields
  const validateTestResultCheckinFields = useMemo(() => {
    if (!showTestResultCheckinFields) return { isValid: true, errors: [] };

    const errors: string[] = [];

    // Test result is locked to "pass" (ผ่าน) - always checked
    if (!testResult) {
      errors.push("กรุณาระบุผลเทส");
    }

    // Only require got_job when test_result is "pass"
    if (testResult === 'pass' && !gotJob) {
      errors.push("กรุณาเลือกว่าได้งานหรือไม่");
    }

    // If got_job is "no", require got_job_reason
    if (gotJob === 'no' && !gotJobReason.trim()) {
      errors.push("กรุณากรอกเหตุผลที่ไม่ได้งาน");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }, [showTestResultCheckinFields, testResult, gotJob, gotJobReason]);

  useEffect(() => {
    console.log("PRESENT Check-in Validation:", showCallNewFields, displayEvent);
  }, [showCallNewFields, displayEvent]);

  // Auto-set test result to "pass" when check-in form is shown for TEST_RESULT sub-type
  useEffect(() => {
    if (showCheckinForm && showTestResultCheckinFields) {
      setTestResult('pass');
    } else {
      setTestResult('');
      setTestResultReason('');
      setGotJob('');
      setGotJobReason('');
    }
  }, [showCheckinForm, showTestResultCheckinFields]);
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

                        {/* Conditional Fields Section */}
                        {showConditionalFieldsSection && (
                           <div className="space-y-4 md:col-span-2">
                            <h4 className="font-semibold text-gray-900 text-sm md:text-base flex items-center gap-2">
                              <FileText className="h-4 w-4 md:h-5 md:w-5 text-indigo-600" />
                              ข้อมูลเพิ่มเติม
                            </h4>
                            <div className="grid md:grid-cols-2 gap-4 p-4 bg-indigo-50 rounded-lg">
                              {/* Sales Before VAT */}
                              {showSalesBeforeVat && displayEvent.sales_before_vat && (
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-green-100 rounded-lg">
                                    <DollarSign className="h-4 w-4 text-green-600" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">ยอดขาย ก่อน Vat</p>
                                    <p className="text-sm font-medium">{displayEvent.sales_before_vat.toLocaleString()} บาท</p>
                                  </div>
                                </div>
                              )}

                              {/* Business Type - only for CALL_NEW_1 or CALL_NEW_2 */}
                              {showCallNewFields && displayEvent.business_type && (
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-blue-100 rounded-lg">
                                    <Briefcase className="h-4 w-4 text-blue-600" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">ประเภทธุรกิจ</p>
                                    <p className="text-sm font-medium">{displayEvent.business_type}</p>
                                  </div>
                                </div>
                              )}

                              {/* Shoe Order Quantity - only for CALL_NEW_1 or CALL_NEW_2 */}
                              {showCallNewFields && displayEvent.shoe_order_quantity && (
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-purple-100 rounded-lg">
                                    <Package className="h-4 w-4 text-purple-600" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">จำนวนรองเท้าที่สั่ง</p>
                                    <p className="text-sm font-medium">{displayEvent.shoe_order_quantity.toLocaleString()} คู่</p>
                                  </div>
                                </div>
                              )}

                              {/* Has Appointment - only for CALL_NEW_1 or CALL_NEW_2 */}
                              {showCallNewFields && displayEvent.has_appointment !== undefined && (
                                <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded-lg ${displayEvent.has_appointment ? 'bg-green-100' : 'bg-red-100'}`}>
                                    {displayEvent.has_appointment ? (
                                      <ThumbsUp className="h-4 w-4 text-green-600" />
                                    ) : (
                                      <ThumbsDown className="h-4 w-4 text-red-600" />
                                    )}
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">ได้นัดหมาย</p>
                                    <p className="text-sm font-medium">{displayEvent.has_appointment ? 'ได้' : 'ไม่ได้'}</p>
                                  </div>
                                </div>
                              )}

                              {/* Purchase Months - only for CALL_NEW_1 or CALL_NEW_2 */}
                              {showCallNewFields && displayEvent.purchase_months && displayEvent.purchase_months.length > 0 && (
                                <div className="flex items-start gap-3 md:col-span-2">
                                  <div className="p-2 bg-orange-100 rounded-lg">
                                    <Calendar className="h-4 w-4 text-orange-600" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">รอบการสั่งซื้อ</p>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {displayEvent.purchase_months.map((month) => {
                                        const monthLabel = MONTHS.find(m => m.value === month)?.label || month;
                                        return (
                                          <Badge key={month} variant="secondary" className="text-xs">
                                            {monthLabel}
                                          </Badge>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Test Result */}
                              {showTestResultFields && displayEvent.test_result && (
                                <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded-lg ${displayEvent.test_result === 'pass' ? 'bg-green-100' : 'bg-red-100'}`}>
                                    {displayEvent.test_result === 'pass' ? (
                                      <ThumbsUp className="h-4 w-4 text-green-600" />
                                    ) : (
                                      <ThumbsDown className="h-4 w-4 text-red-600" />
                                    )}
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">ผลเทส</p>
                                    <p className="text-sm font-medium">{displayEvent.test_result === 'pass' ? 'ผ่าน' : 'ไม่ผ่าน'}</p>
                                  </div>
                                </div>
                              )}

                              {/* Test Result Reason */}
                              {showTestResultFields && displayEvent.test_result_reason && (
                                <div className="flex items-start gap-3 md:col-span-2">
                                  <div className="p-2 bg-red-100 rounded-lg">
                                    <FileText className="h-4 w-4 text-red-600" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">เหตุผลที่ไม่ผ่าน</p>
                                    <p className="text-sm font-medium">{displayEvent.test_result_reason}</p>
                                  </div>
                                </div>
                              )}

                              {/* Got Job */}
                              {showTestResultFields && displayEvent.got_job && (
                                <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded-lg ${displayEvent.got_job === 'yes' ? 'bg-green-100' : 'bg-red-100'}`}>
                                    {displayEvent.got_job === 'yes' ? (
                                      <ThumbsUp className="h-4 w-4 text-green-600" />
                                    ) : (
                                      <ThumbsDown className="h-4 w-4 text-red-600" />
                                    )}
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">ได้งาน</p>
                                    <p className="text-sm font-medium">{displayEvent.got_job === 'yes' ? 'ได้' : 'ไม่ได้'}</p>
                                  </div>
                                </div>
                              )}

                              {/* Got Job Reason */}
                              {showTestResultFields && displayEvent.got_job_reason && (
                                <div className="flex items-start gap-3 md:col-span-2">
                                  <div className="p-2 bg-red-100 rounded-lg">
                                    <FileText className="h-4 w-4 text-red-600" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">เหตุผลที่ไม่ได้งาน</p>
                                    <p className="text-sm font-medium">{displayEvent.got_job_reason}</p>
                                  </div>
                                </div>
                              )}

                              {/* Problem Types */}
                              {showProblemTypeField && displayEvent.problem_types && displayEvent.problem_types.length > 0 && (
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-amber-100 rounded-lg">
                                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">ประเภทปัญหา</p>
                                    <p className="text-sm font-medium">
                                      {displayEvent.problem_types.map(pt => PROBLEM_TYPES.find(p => p.value === pt)?.label || pt).join(', ')}
                                    </p>
                                  </div>
                                </div>
                              )}

                              {/* Present Time */}
                              {showTimePicker && displayEvent.present_time && (
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-indigo-100 rounded-lg">
                                    <Clock className="h-4 w-4 text-indigo-600" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">เวลานัดหมาย</p>
                                    <p className="text-sm font-medium">{displayEvent.present_time} น.</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Product Tags Section */}
                        <div className="space-y-2">
                          <h4 className="font-semibold text-gray-900 text-sm md:text-base flex items-center gap-2">
                            <Tag className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                            แท็กสินค้า
                          </h4>
                          <div className="p-4 bg-gray-50 rounded-lg">
                            {displayEvent.taggedProducts && displayEvent.taggedProducts.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {displayEvent.taggedProducts.map((product) => (
                                  <Badge
                                    key={product.id}
                                    variant="secondary"
                                    className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200 text-xs md:text-sm px-3 py-1"
                                  >
                                    {product.name} ({product.price.toLocaleString("th-TH", { style: "currency", currency: "THB" })})
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-500 text-sm md:text-base italic">
                                ไม่มีสินค้าแท็กไว้
                              </p>
                            )}
                          </div>
                        </div>
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
                            placeholder={showPresentCheckinFields ? "ความต้องการพิเศษของลูกค้า..." : "รายละเอียดการเช็คอิน..."}
                            value={checkinDetail}
                            onChange={(e) => {
                              setCheckinDetail(e.target.value);
                              setCheckinError(null);
                            }}
                            className={cn("min-h-[100px]", checkinFormSubmitted && requireCheckinDetail && !checkinDetail.trim() && "border-red-500 focus-visible:ring-red-500")}
                          />

                          <ImageUploader
                            onImageUploaded={(urls) => setCheckinImages(urls)}
                            onImageRemoved={() => setCheckinImages([])}
                            multiple={true}
                            bucketName="events"
                            folderPath={`${event?.id}/checkins`}
                            hasError={checkinFormSubmitted && (requireCheckinImages || showPresentCheckinFields) && checkinImages.length === 0}
                          />

                          {/* PRESENT Check-in Fields */}
                          {showPresentCheckinFields && (
                            <div className="border-t pt-4 mt-4">
                              <h4 className="font-medium text-sm md:text-base mb-4 flex items-center gap-2">
                                <FileText className="h-4 w-4 text-indigo-600" />
                                ข้อมูลการนำเสนอ
                              </h4>
                              <PresentCheckinFields
                                products={products}
                                isEditing={true}
                                images={checkinImages}
                                productSelections={productSelections}
                                deliveryDuration={deliveryDuration}
                                purchaseType={purchaseType}
                                purchaseMonths={purchaseMonths}
                                competitorBrand={competitorBrand}
                                specialRequirements={specialRequirements}
                                onProductSelectionsChange={setProductSelections}
                                onDeliveryDurationChange={setDeliveryDuration}
                                onPurchaseTypeChange={setPurchaseType}
                                onPurchaseMonthsChange={setPurchaseMonths}
                                onCompetitorBrandChange={setCompetitorBrand}
                                onSpecialRequirementsChange={setSpecialRequirements}
                                showValidation={checkinFormSubmitted}
                              />
                            </div>
                          )}

                          {/* TEST_RESULT Check-in Fields */}
                          {showTestResultCheckinFields && (
                            <div className="border-t pt-4 mt-4">
                              <h4 className="font-medium text-sm md:text-base mb-4 flex items-center gap-2">
                                <FileText className="h-4 w-4 text-indigo-600" />
                                ข้อมูลผลเทส
                              </h4>
                              <TestResultFields
                                testResult={testResult}
                                testResultReason={testResultReason}
                                gotJob={gotJob}
                                gotJobReason={gotJobReason}
                                onTestResultChange={setTestResult}
                                onTestResultReasonChange={setTestResultReason}
                                onGotJobChange={setGotJob}
                                onGotJobReasonChange={setGotJobReason}
                                showValidation={checkinFormSubmitted}
                              />
                            </div>
                          )}

                          {/* FOUND_PROBLEM Check-in Fields */}
                          {requireProblemType && (
                            <div className="border-t pt-4 mt-4">
                              <h4 className="font-medium text-sm md:text-base mb-4 flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-amber-600" />
                                ข้อมูลปัญหา
                              </h4>
                              <ProblemTypeField
                                value={problemTypes}
                                onChange={setProblemTypes}
                                showValidation={checkinFormSubmitted}
                              />
                            </div>
                          )}

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
                          <h4 className="font-semibold text-lg">ประวัติการเช็คอิน</h4>
                          <div className="space-y-3">
                            {checkins.map((checkin: EventCheckin, index: number) => (
                              <Card key={checkin.id} className="overflow-hidden">
                                <CardContent className="p-4">
                                  <div className="flex gap-3">
                                    <div className="flex-shrink-0">
                                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                        <CheckCircle2 className="h-5 w-5 text-blue-600" />
                                      </div>
                                    </div>
                                    <div className="flex-1 min-w-0 space-y-3">
                                      <div className="flex md:flex-row flex-col items-start md:items-center justify-between gap-2">
                                        <span className="font-medium text-gray-900">เช็คอิน #{index + 1}</span>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                          <Badge variant="secondary">
                                            {formatThaiDate(checkin.created_at)}
                                          </Badge>
                                          <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {new Date(checkin.created_at).toLocaleTimeString('th-TH', {
                                              hour: '2-digit',
                                              minute: '2-digit',
                                              hour12: false
                                            })}
                                          </span>
                                        </div>
                                      </div>

                                      {checkin.detail && (
                                        <div className="p-3 rounded-lg bg-gray-50 border">
                                          <p className="text-sm text-gray-700 leading-relaxed">{checkin.detail}</p>
                                        </div>
                                      )}

                                      {checkin.images && checkin.images.length > 0 && (
                                        <div className="space-y-2">
                                          <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                                            <Camera className="h-4 w-4 text-blue-600" />
                                            <span>รูปภาพ ({checkin.images.length})</span>
                                          </div>
                                          <div className="rounded-lg overflow-hidden border">
                                            <ImageGallery
                                              images={checkin.images}
                                              bucket="event-checkins"
                                              isPrivate={true}
                                            />
                                          </div>
                                        </div>
                                      )}

                                      {(checkin.product_selections?.length || checkin.delivery_duration || checkin.purchase_type || checkin.purchase_months?.length || checkin.competitor_brand) && (
                                        <div className="space-y-2 rounded-lg bg-indigo-50 border border-indigo-200">
                                          <div className="px-3 py-2 border-b border-indigo-200 bg-indigo-600">
                                            <h5 className="text-sm font-semibold text-white flex items-center gap-2">
                                              <FileText className="h-4 w-4" />
                                              ข้อมูลการนำเสนอ
                                            </h5>
                                          </div>
                                          <div className="p-3">
                                            <PresentCheckinFields
                                              products={products}
                                              isEditing={false}
                                              productSelections={checkin.product_selections || []}
                                              deliveryDuration={checkin.delivery_duration || ""}
                                              purchaseType={checkin.purchase_type}
                                              purchaseMonths={checkin.purchase_months || []}
                                              competitorBrand={checkin.competitor_brand || ""}
                                              specialRequirements={checkin.special_requirements || ""}
                                            />
                                          </div>
                                        </div>
                                      )}

                                      {(checkin.test_result || checkin.got_job) && (
                                        <div className="space-y-2 rounded-lg bg-emerald-50 border border-emerald-200">
                                          <div className="px-3 py-2 border-b border-emerald-200 bg-emerald-600">
                                            <h5 className="text-sm font-semibold text-white flex items-center gap-2">
                                              <CheckCircle2 className="h-4 w-4" />
                                              ข้อมูลผลเทส
                                            </h5>
                                          </div>
                                          <div className="p-3">
                                            <TestResultFields
                                              testResult={checkin.test_result || ""}
                                              testResultReason={checkin.test_result_reason || ""}
                                              gotJob={checkin.got_job || ""}
                                              gotJobReason={checkin.got_job_reason || ""}
                                              onTestResultChange={() => {}}
                                              onTestResultReasonChange={() => {}}
                                              onGotJobChange={() => {}}
                                              onGotJobReasonChange={() => {}}
                                            />
                                          </div>
                                        </div>
                                      )}

                                      {checkin.problem_types && checkin.problem_types.length > 0 && (
                                        <div className="space-y-2 rounded-lg bg-red-50 border border-red-300">
                                          <div className="px-3 py-2 border-b border-red-300 bg-red-600">
                                            <h5 className="text-sm font-semibold text-white flex items-center gap-2">
                                              <AlertTriangle className="h-4 w-4" />
                                              ประเภทปัญหา
                                            </h5>
                                          </div>
                                          <div className="p-3">
                                            <div className="flex flex-wrap gap-2">
                                              {checkin.problem_types.map(pt => (
                                                <Badge key={pt} variant="secondary" className="bg-red-100 text-red-700 border-red-200 hover:bg-red-200">
                                                  {PROBLEM_TYPES.find(p => p.value === pt)?.label || pt}
                                                </Badge>
                                              ))}
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
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


                  {/* Event Tracking */}
                  {trackingSteps.length > 0 && (
                    <DeliveryTracking
                      eventId={event?.id}
                      initialSteps={trackingSteps}
                      isLoadingTimeline={isLoadingTimeline}
                      onReceiveProduct={onReceiveProduct}
                    />
                  )}

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