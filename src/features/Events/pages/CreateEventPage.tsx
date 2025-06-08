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
import { SelectProductDialog } from "../components/SelectProductDialog";
import { Product, ProductVariant } from "@/entities/Product/product";
import { ImageUploader } from "@/shared/components/ImageUploader/ImageUploader";
import { CompanyHeader } from "../components/CompanyHeader";
import { EventTypeSelector } from "../components/EventTypeSelector";
import { DateSelector } from "../components/DateSelector";
import { ProductSelectionTable } from "../components/ProductSelectionTable";
import { useCreateEvent } from "../services/eventService";
import { toast } from "sonner";

interface SelectedProduct {
  id: string;
  name: string;
  quantity: number;
  variant?: {
    id: string;
    sku: string;
    attributes: Record<string, any>;
    price: number;
    stock: number;
  };
  return_date: Date | null;
}

export function CreateEventPage() {
  const navigate = useNavigate();
  const { companyId } = useParams<{ companyId: string }>();
  const createEvent = useCreateEvent();
  const [company, setCompany] = React.useState<Company | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [selectedProducts, setSelectedProducts] = React.useState<SelectedProduct[]>([]);
  const [isProductDialogOpen, setIsProductDialogOpen] = React.useState(false);
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
    try {
      const body = {
        ...formData,
        scheduled_at: formData.scheduled_at.toISOString(),
        test_start_at: formData.test_start_at ? formData.test_start_at.toISOString() : "",
        test_end_at: formData.test_end_at ? formData.test_end_at.toISOString() : "",
        products: selectedProducts
          .filter(p => p.variant?.id)
          .map(p => ({
            variant_id: p.variant!.id,
            quantity: p.quantity,
            return_date: p.return_date ? p.return_date.toISOString() : null
          })),
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
    const productSubTypes = ["1", "5", "7", "8", "9"];
    return productSubTypes.includes(formData.sub_type_id);
  }, [formData.sub_type_id]);

  const handleAddProduct = () => {
    setIsProductDialogOpen(true);
  };

  const handleProductSelect = (product: Product, variant: ProductVariant, returnDate: Date | null) => {
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
            />

            <div className="space-y-2">
              <Label htmlFor="customer_id">ผู้ติดต่อ</Label>
              <Select
                value={formData.customer_id}
                onValueChange={(value) => {
                  console.log('Selected customer:', value);
                  setFormData(prev => ({ ...prev, customer_id: value }));
                }}
              >
                <SelectTrigger className="w-full">
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
              showTestDateRange={formData.sub_type_id === "5"}
            />

            <div className="space-y-2">
              <Label htmlFor="description">รายละเอียด</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="กรอกรายละเอียดกิจกรรม"
                className="min-h-[100px] w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>รูปภาพกิจกรรม</Label>
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