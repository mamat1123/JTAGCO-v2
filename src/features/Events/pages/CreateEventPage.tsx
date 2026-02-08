import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { companyAPI } from "@/entities/Company/companyAPI";
import { Company } from "@/entities/Company/company";
import { useEventMainTypes } from "../hooks/useEventMainTypes";
import { useEventSubTypes } from "../hooks/useEventSubTypes";
import { useProducts } from "@/features/Settings/Products/hooks/useProducts";
import { SelectProductDialog } from "../components/SelectProductDialog";
import { ProductTagSelector } from "../components/ProductTagSelector";
import { Product, ProductVariant } from "@/entities/Product/product";
import { ImageUploader } from "@/shared/components/ImageUploader/ImageUploader";
import { CompanyHeader } from "../components/CompanyHeader";
import { EventTypeSelector } from "../components/EventTypeSelector";
import { DateSelector } from "../components/DateSelector";
import { ProductSelectionTable } from "../components/ProductSelectionTable";
import { useCreateEvent } from "../services/eventService";
import { toast } from "sonner";
import {
  SUB_TYPE_CODES,
  SUB_TYPE_THAI_NAMES,
} from "@/shared/constants/eventSubTypes";
import {
  SalesBeforeVatField,
  CallNewFields,
  TestResultFields,
  ProblemTypeField,
  PresentTimeField,
} from "../components/ConditionalFields";

interface SelectedProduct {
  id: string;
  name: string;
  quantity: number;
  variant?: {
    id: string;
    sku: string;
    attributes: Record<string, string | number>;
    price: number;
    stock: number;
  };
  return_date: Date | null;
  pickup_date: Date | null;
}

interface TaggedProduct {
  product_id: string;
  name: string;
  price: number;
}

// Helper function to get sub_type code
const getSubTypeCode = (subType: { code?: string; name: string } | undefined): string => {
  if (!subType) return '';
  // Try code first, fallback to name mapping
  if (subType.code) return subType.code;
  return SUB_TYPE_THAI_NAMES[subType.name] || '';
};

export function CreateEventPage() {
  const navigate = useNavigate();
  const { companyId } = useParams<{ companyId: string }>();
  const createEvent = useCreateEvent();
  const [company, setCompany] = React.useState<Company | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [selectedProducts, setSelectedProducts] = React.useState<SelectedProduct[]>([]);
  const [isProductDialogOpen, setIsProductDialogOpen] = React.useState(false);
  const [productTagValidation, setProductTagValidation] = React.useState(true);
  const [formSubmitted, setFormSubmitted] = React.useState(false);
  const [formData, setFormData] = React.useState({
    description: "",
    scheduled_at: new Date(),
    test_start_at: null as Date | null,
    test_end_at: null as Date | null,
    main_type_id: "",
    sub_type_id: "",
    company_id: companyId || "",
    customer_id: "",
    image_urls: [] as string[],
    tagged_products: [] as TaggedProduct[],
    // New conditional fields
    sales_before_vat: undefined as number | undefined,
    business_type: "",
    shoe_order_quantity: undefined as number | undefined,
    has_appointment: undefined as boolean | undefined,
    purchase_months: [] as string[],
    test_result: "",
    test_result_reason: "",
    got_job: "",
    got_job_reason: "",
    problem_type: "",
    present_time: "",
  });
  const [date, setDate] = React.useState<Date>(new Date());
  const [testDateRange, setTestDateRange] = React.useState<{
    from: Date | undefined;
    to?: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  const { data: mainTypes = [], isLoading: isLoadingMainTypes } = useEventMainTypes();
  const { data: subTypes = [], isLoading: isLoadingSubTypes } = useEventSubTypes(
    formData.main_type_id || undefined
  );
  const { data: products = [], isLoading: isLoadingProducts } = useProducts();

  // Get selected sub type object
  const selectedSubType = React.useMemo(() => {
    if (!formData.sub_type_id) return undefined;
    return subTypes.find(st => st.id.toString() === formData.sub_type_id);
  }, [formData.sub_type_id, subTypes]);

  // Get sub type code for conditional logic
  const subTypeCode = React.useMemo(() => {
    return getSubTypeCode(selectedSubType);
  }, [selectedSubType]);

  // Check if selected main type is a visit type (เข้าพบ)
  const isVisitEvent = React.useMemo(() => {
    if (!formData.main_type_id) return false;
    const selectedMainType = mainTypes.find(type => type.id.toString() === formData.main_type_id);
    if (!selectedMainType) return false;
    return selectedMainType.name.includes('เข้าพบ');
  }, [formData.main_type_id, mainTypes]);

  // Conditional field visibility flags
  const showSalesBeforeVat = React.useMemo(() => {
    return [SUB_TYPE_CODES.PO_NEW, SUB_TYPE_CODES.PO_OLD].includes(subTypeCode as any);
  }, [subTypeCode]);

  const showCallNewFields = React.useMemo(() => {
    return [SUB_TYPE_CODES.CALL_NEW_1, SUB_TYPE_CODES.CALL_NEW_2].includes(subTypeCode as any);
  }, [subTypeCode]);

  const showTestResultFields = React.useMemo(() => {
    return subTypeCode === SUB_TYPE_CODES.TEST_RESULT;
  }, [subTypeCode]);

  // Show test date range for SENT_TEST sub type
  const showTestDateRange = React.useMemo(() => {
    return subTypeCode === SUB_TYPE_CODES.SENT_TEST;
  }, [subTypeCode]);

  // Require test date range for SENT_TEST
  const requireTestDateRange = React.useMemo(() => {
    return subTypeCode === SUB_TYPE_CODES.SENT_TEST;
  }, [subTypeCode]);

  const showPresentTimeField = React.useMemo(() => {
    return subTypeCode === SUB_TYPE_CODES.PRESENT;
  }, [subTypeCode]);

  // Check if selected main type is FIRST_VISIT (เข้าพบครั้งแรก)
  const isFirstVisitMainType = React.useMemo(() => {
    if (!formData.main_type_id) return false;
    const selectedMainType = mainTypes.find(type => type.id.toString() === formData.main_type_id);
    if (!selectedMainType) return false;
    return selectedMainType.code === 'FIRST_VISIT' || selectedMainType.name.includes('เข้าพบครั้งแรก');
  }, [formData.main_type_id, mainTypes]);

  // Show time picker for PRESENT sub type OR FIRST_VISIT main type
  const showTimePicker = React.useMemo(() => {
    return showPresentTimeField || isFirstVisitMainType;
  }, [showPresentTimeField, isFirstVisitMainType]);

  // Description required for specific sub types (only CALL_OLD now)
  const requireDescription = React.useMemo(() => {
    return [SUB_TYPE_CODES.CALL_OLD].includes(subTypeCode as any);
  }, [subTypeCode]);

  // Shoe + insole requirement for specific sub types (NOT for CALL_NEW_1, CALL_NEW_2)
  const requireShoeAndInsole = React.useMemo(() => {
    const requiresProductTypes = [
      SUB_TYPE_CODES.QUOTATION_NEW,
      SUB_TYPE_CODES.QUOTATION_OLD,
      SUB_TYPE_CODES.PO_NEW,
      SUB_TYPE_CODES.PO_OLD,
      SUB_TYPE_CODES.CALL_OLD,
      SUB_TYPE_CODES.SHIPPING,
      SUB_TYPE_CODES.BILLING,
      SUB_TYPE_CODES.ACCEPTING_CHEQUE,
      SUB_TYPE_CODES.SENT_TEST,
      SUB_TYPE_CODES.CHANGE_SIZE,
      SUB_TYPE_CODES.MEASURE,
      SUB_TYPE_CODES.TEST_RESULT,
      SUB_TYPE_CODES.VISIT_SEND_SAMPLE,
      SUB_TYPE_CODES.EXHIBIT_BOOTHS,
      SUB_TYPE_CODES.FOUND_PROBLEM,
      SUB_TYPE_CODES.OTHER,
    ];
    return requiresProductTypes.includes(subTypeCode as any);
  }, [subTypeCode]);

  // Images required for specific sub types (NOT for most VISIT types - only checkin required)
  const requireImages = React.useMemo(() => {
    const requiresImageTypes = [
      SUB_TYPE_CODES.QUOTATION_NEW,
      SUB_TYPE_CODES.QUOTATION_OLD,
      SUB_TYPE_CODES.PO_NEW,
      SUB_TYPE_CODES.PO_OLD,
      // Note: Most VISIT types don't require images on create, only on checkin
      SUB_TYPE_CODES.ACCEPTING_CHEQUE,
      SUB_TYPE_CODES.TEST_RESULT,
      SUB_TYPE_CODES.VISIT_SEND_SAMPLE,
    ];
    return requiresImageTypes.includes(subTypeCode as any);
  }, [subTypeCode]);

  // Customer required for VISIT types, and specific sub types
  const requireCustomer = React.useMemo(() => {
    return isVisitEvent || 
           [
             SUB_TYPE_CODES.QUOTATION_NEW,
             SUB_TYPE_CODES.QUOTATION_OLD,
             SUB_TYPE_CODES.PO_NEW,
             SUB_TYPE_CODES.PO_OLD,
             SUB_TYPE_CODES.CALL_OLD,
             SUB_TYPE_CODES.SHIPPING,
             SUB_TYPE_CODES.BILLING,
           ].includes(subTypeCode as any);
  }, [isVisitEvent, subTypeCode]);

  // Get min date for calendar (today if visit event, undefined otherwise)
  const minDate = React.useMemo(() => {
    return isVisitEvent ? new Date() : undefined;
  }, [isVisitEvent]);

  // Reset conditional fields when sub_type changes
  React.useEffect(() => {
    setFormSubmitted(false);
    setFormData(prev => ({
      ...prev,
      sales_before_vat: undefined,
      business_type: "",
      shoe_order_quantity: undefined,
      has_appointment: undefined,
      purchase_months: [],
      test_result: "",
      test_result_reason: "",
      got_job: "",
      got_job_reason: "",
      problem_type: "",
      present_time: "",
    }));
  }, [formData.sub_type_id]);

  // Reset date to today if it's a visit event and current date is in the past
  React.useEffect(() => {
    if (isVisitEvent && date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const currentDate = new Date(date);
      currentDate.setHours(0, 0, 0, 0);

      if (currentDate < today) {
        setDate(new Date());
      }
    }
  }, [isVisitEvent, date]);

  React.useEffect(() => {
    const fetchCompany = async () => {
      if (!companyId) {
        navigate('/events');
        return;
      }
      try {
        const companyData = await companyAPI.getCompany(companyId);
        setCompany(companyData);
      } catch (error) {
        console.error('Error fetching company:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [companyId, navigate]);

  React.useEffect(() => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        scheduled_at: date
      }));
    }
  }, [date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);

    // Validate required fields
    let hasError = false;

    // Main type always required
    if (!formData.main_type_id) {
      hasError = true;
    }

    // Sub type required if options exist
    if (subTypes.length > 0 && !formData.sub_type_id) {
      hasError = true;
    }

    // Customer required only for VISIT types
    if (requireCustomer && !formData.customer_id) {
      hasError = true;
    }

    // Images required for specific sub types
    if (requireImages && formData.image_urls.length === 0) {
      hasError = true;
    }

    // Validate shoe + insole requirement
    if (requireShoeAndInsole && !productTagValidation) {
      hasError = true;
    }

    // Validate sales_before_vat for PO sub types
    if (showSalesBeforeVat && (!formData.sales_before_vat || formData.sales_before_vat <= 0)) {
      hasError = true;
    }

    // Validate call new fields
    if (showCallNewFields) {
      if (!formData.business_type) {
        hasError = true;
      }
      if (!formData.shoe_order_quantity || formData.shoe_order_quantity <= 0) {
        hasError = true;
      }
      if (formData.has_appointment === undefined) {
        hasError = true;
      }
      if (formData.has_appointment && formData.purchase_months.length === 0) {
        hasError = true;
      }
    }

    // Validate test result fields
    if (showTestResultFields) {
      if (!formData.test_result) {
        hasError = true;
      }
      if (formData.test_result === 'fail' && !formData.test_result_reason) {
        hasError = true;
      }
      if (formData.test_result === 'pass') {
        if (!formData.got_job) {
          hasError = true;
        }
        if (formData.got_job === 'no' && !formData.got_job_reason) {
          hasError = true;
        }
      }
    }

    // Validate test date range for SENT_TEST
    if (requireTestDateRange && (!testDateRange.from || !testDateRange.to)) {
      hasError = true;
    }

    // Validate description for specific sub types
    if (requireDescription && !formData.description.trim()) {
      hasError = true;
    }

    // Validate present time for PRESENT sub type or FIRST_VISIT main type
    if (showTimePicker && !formData.present_time) {
      hasError = true;
    }

    if (hasError) {
      return;
    }

    try {
      // Adjust all dates to keep them in the same day in UTC
      const adjustDate = (date: Date | null) => {
        if (!date) return "";
        const adjusted = new Date(date);
        adjusted.setHours(adjusted.getHours() + 7);
        return adjusted.toISOString();
      };

      const body = {
        ...formData,
        scheduled_at: adjustDate(formData.scheduled_at),
        test_start_at: adjustDate(formData.test_start_at),
        test_end_at: adjustDate(formData.test_end_at),
        products: selectedProducts
          .filter(p => p.variant?.id)
          .map(p => ({
            variant_id: p.variant!.id,
            quantity: p.quantity,
            return_date: p.return_date ? adjustDate(p.return_date) : null,
            pickup_date: p.pickup_date ? adjustDate(p.pickup_date) : null
          })),
        tagged_products: formData.tagged_products
          .filter(tp => tp.price !== undefined && tp.price !== null)
          .map(tp => ({
            product_id: tp.product_id,
            price: tp.price as number
          })),
        // Include conditional fields
        sales_before_vat: showSalesBeforeVat ? formData.sales_before_vat : undefined,
        business_type: showCallNewFields ? formData.business_type : undefined,
        shoe_order_quantity: showCallNewFields ? formData.shoe_order_quantity : undefined,
        has_appointment: showCallNewFields ? formData.has_appointment : undefined,
        purchase_months: showCallNewFields && formData.has_appointment ? formData.purchase_months : undefined,
        test_result: showTestResultFields ? formData.test_result : undefined,
        test_result_reason: showTestResultFields && formData.test_result === 'fail' ? formData.test_result_reason : undefined,
        got_job: showTestResultFields && formData.test_result === 'pass' ? formData.got_job : undefined,
        got_job_reason: showTestResultFields && formData.test_result === 'pass' && formData.got_job === 'no' ? formData.got_job_reason : undefined,
        problem_type: undefined,
        present_time: showTimePicker ? formData.present_time : undefined,
      }
      await createEvent.mutateAsync(body);
      toast.success("สร้างกิจกรรมสำเร็จ");
      navigate(`/companies/${companyId}`);
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error("เกิดข้อผิดพลาดในการสร้างกิจกรรม");
    }
  };

  const showProductSelection = React.useMemo(() => {
    return true;
    // const productSubTypes = ["1", "5", "7", "8", "9"];
    // return productSubTypes.includes(formData.sub_type_id);
  }, []);

  const handleAddProduct = () => {
    setIsProductDialogOpen(true);
  };

  const handleProductSelect = (product: Product, variant: ProductVariant, returnDate: Date | null, pickupDate: Date | null) => {
    setSelectedProducts([
      ...selectedProducts,
      {
        id: product.id,
        name: product.name,
        quantity: 1,
        variant: {
          id: variant.id,
          sku: variant.sku,
          attributes: variant.attributes,
          price: variant.price,
          stock: variant.stock,
        },
        return_date: returnDate,
        pickup_date: pickupDate,
      },
    ]);
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    setSelectedProducts(selectedProducts.map(p =>
      p.id === productId ? { ...p, quantity } : p
    ));
  };

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto p-4 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="container max-w-4xl mx-auto p-4">
        <div className="text-red-500">ไม่พบข้อมูลบริษัท</div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-semibold">สร้างกิจกรรมใหม่</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <CompanyHeader company={company} />

        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">รายละเอียดกิจกรรม</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <EventTypeSelector
              mainTypes={mainTypes}
              subTypes={subTypes}
              isLoadingMainTypes={isLoadingMainTypes}
              isLoadingSubTypes={isLoadingSubTypes}
              selectedMainType={formData.main_type_id}
              selectedSubType={formData.sub_type_id}
              onMainTypeChange={(value) => {
                setFormData({
                  ...formData,
                  main_type_id: value,
                  sub_type_id: "" // Reset sub type when main type changes
                });
              }}
              onSubTypeChange={(value) =>
                setFormData({ ...formData, sub_type_id: value })
              }
              showValidation={formSubmitted}
            />

            <div className="space-y-2">
              <Label htmlFor="customer_id">ผู้ติดต่อ{requireCustomer && ' *'}</Label>
              <Select
                value={formData.customer_id}
                onValueChange={(value) => {
                  console.log('Selected customer:', value);
                  setFormData(prev => ({ ...prev, customer_id: value }));
                }}
              >
                <SelectTrigger className="w-full" aria-invalid={formSubmitted && requireCustomer && !formData.customer_id}>
                  <SelectValue placeholder="เลือกผู้ติดต่อ" />
                </SelectTrigger>
                <SelectContent>
                  {company?.customers?.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id.toString()}>
                      {customer.contact_name} - {customer.position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formSubmitted && requireCustomer && !formData.customer_id && (
                <p className="text-sm text-destructive">กรุณาเลือกผู้ติดต่อ</p>
              )}
            </div>

            <DateSelector
              date={date}
              onDateChange={setDate}
              testDateRange={testDateRange}
              onTestDateRangeChange={(range) => {
                setTestDateRange(range);
                setFormData(prev => ({
                  ...prev,
                  test_start_at: range.from || null,
                  test_end_at: range.to || null,
                }));
              }}
              showTestDateRange={showTestDateRange}
              requireTestDateRange={requireTestDateRange}
              minDate={minDate}
            />

            <div className="space-y-2">
              <Label htmlFor="description">รายละเอียด{requireDescription && ' *'}</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="กรอกรายละเอียดกิจกรรม"
                className="min-h-[100px] w-full"
                aria-invalid={formSubmitted && requireDescription && !formData.description.trim()}
              />
              {formSubmitted && requireDescription && !formData.description.trim() && (
                <p className="text-sm text-destructive">กรุณากรอกรายละเอียด</p>
              )}
            </div>

            {/* Conditional Fields */}
            {showSalesBeforeVat && (
              <SalesBeforeVatField
                value={formData.sales_before_vat}
                onChange={(value) => setFormData(prev => ({ ...prev, sales_before_vat: value }))}
                showValidation={formSubmitted}
              />
            )}

            {showCallNewFields && (
              <CallNewFields
                businessType={formData.business_type}
                shoeOrderQuantity={formData.shoe_order_quantity}
                hasAppointment={formData.has_appointment}
                purchaseMonths={formData.purchase_months}
                onBusinessTypeChange={(value) => setFormData(prev => ({ ...prev, business_type: value }))}
                onShoeOrderQuantityChange={(value) => setFormData(prev => ({ ...prev, shoe_order_quantity: value }))}
                onHasAppointmentChange={(value) => setFormData(prev => ({ ...prev, has_appointment: value }))}
                onPurchaseMonthsChange={(value) => setFormData(prev => ({ ...prev, purchase_months: value }))}
                showValidation={formSubmitted}
              />
            )}

            {showTestResultFields && (
              <TestResultFields
                testResult={formData.test_result}
                testResultReason={formData.test_result_reason}
                gotJob={formData.got_job}
                gotJobReason={formData.got_job_reason}
                onTestResultChange={(value) => setFormData(prev => ({ ...prev, test_result: value }))}
                onTestResultReasonChange={(value) => setFormData(prev => ({ ...prev, test_result_reason: value }))}
                onGotJobChange={(value) => setFormData(prev => ({ ...prev, got_job: value }))}
                onGotJobReasonChange={(value) => setFormData(prev => ({ ...prev, got_job_reason: value }))}
                showValidation={formSubmitted}
              />
            )}

            {showTimePicker && (
              <PresentTimeField
                value={formData.present_time}
                onChange={(value) => setFormData(prev => ({ ...prev, present_time: value }))}
                showValidation={formSubmitted}
                label={showPresentTimeField ? "เวลานำเสนอ" : "เวลานัดหมาย"}
              />
            )}

            <div className="space-y-2">
              <Label>รูปภาพกิจกรรม{requireImages && ' *'}</Label>
              <div className={formSubmitted && requireImages && formData.image_urls.length === 0 ? 'border border-destructive rounded-md p-1' : ''}>
                <ImageUploader
                  multiple={true}
                  onImageUploaded={(urls) => setFormData({ ...formData, image_urls: urls })}
                  onImageRemoved={() => {
                    if (formData.image_urls.length > 0) {
                      setFormData(prev => ({ ...prev, image_urls: prev.image_urls }));
                    } else {
                      setFormData(prev => ({ ...prev, image_urls: [] }));
                    }
                  }}
                  maxSizeMB={5}
                  bucketName="events"
                  folderPath={company.id.toString()}
                  className="w-full"
                />
              </div>
              {formSubmitted && requireImages && formData.image_urls.length === 0 && (
                <p className="text-sm text-destructive">กรุณาอัปโหลดรูปภาพ</p>
              )}
            </div>

            <ProductTagSelector
              products={products}
              taggedProducts={formData.tagged_products}
              onTaggedProductsChange={(taggedProducts) =>
                setFormData(prev => ({ ...prev, tagged_products: taggedProducts }))
              }
              isLoading={isLoadingProducts}
              requireShoeAndInsole={requireShoeAndInsole}
              onValidationChange={setProductTagValidation}
              showValidation={formSubmitted}
            />

            {showProductSelection && (
              <ProductSelectionTable
                selectedProducts={selectedProducts}
                onAddProduct={handleAddProduct}
                onRemoveProduct={handleRemoveProduct}
                onQuantityChange={handleQuantityChange}
              />
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/events')}
            className="w-full sm:w-auto"
            disabled={createEvent.isPending}
          >
            ยกเลิก
          </Button>
          <Button
            type="submit"
            className="w-full sm:w-auto"
            disabled={createEvent.isPending}
          >
            {createEvent.isPending ? "กำลังบันทึก..." : "บันทึก"}
          </Button>
        </div>
      </form>

      <SelectProductDialog
        isOpen={isProductDialogOpen}
        onOpenChange={setIsProductDialogOpen}
        onSelect={handleProductSelect}
      />
    </div>
  );
}
