import * as React from "react";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Badge } from "@/shared/components/ui/badge";
import { X, AlertCircle, Plus } from "lucide-react";
import { ProductSelection } from "@/entities/Event/types";
import { Product, ProductType } from "@/entities/Product/product";
import { NO_INSOLE_NAME, MONTHS } from "@/shared/constants/eventSubTypes";
import { cn } from "@/lib/utils";

const PRICE_RANGES = [
  { value: "<400", label: "ต่ำกว่า 400" },
  { value: "400-450", label: "400-450" },
  { value: "451-500", label: "451-500" },
  { value: "501-550", label: "501-550" },
  { value: "551-600", label: "551-600" },
  { value: "601-650", label: "601-650" },
  { value: "650+", label: "651 ขึ้นไป" },
];

const DELIVERY_DURATIONS = [
  { value: "1", label: "1 สัปดาห์" },
  { value: "2", label: "2 สัปดาห์" },
  { value: "3", label: "3 สัปดาห์" },
  { value: "4", label: "4 สัปดาห์" },
  { value: "5+", label: "5 สัปดาห์ ขึ้นไป" },
];

// Individual product selection with its own price range
interface ProductSelectionItem {
  id: string;
  product_id: string;
  name: string;
  price: number;
  price_range: string;
}

interface PresentCheckinFieldsProps {
  products: Product[];
  isEditing: boolean;
  images?: string[];
  productSelections?: ProductSelection[];
  deliveryDuration?: string;
  purchaseType?: "monthly" | "yearly";
  purchaseMonths?: string[];
  competitorBrand?: string;
  specialRequirements?: string;
  onProductSelectionsChange?: (selections: ProductSelection[]) => void;
  onDeliveryDurationChange?: (duration: string) => void;
  onPurchaseTypeChange?: (type: "monthly" | "yearly") => void;
  onPurchaseMonthsChange?: (months: string[]) => void;
  onCompetitorBrandChange?: (brand: string) => void;
  onSpecialRequirementsChange?: (value: string) => void;
  showValidation?: boolean;
}

export function PresentCheckinFields({
  products,
  isEditing,
  images = [],
  productSelections = [],
  deliveryDuration = "",
  purchaseType,
  purchaseMonths = [],
  competitorBrand = "",
  specialRequirements = "",
  onProductSelectionsChange,
  onDeliveryDurationChange,
  onPurchaseTypeChange,
  onPurchaseMonthsChange,
  onCompetitorBrandChange,
  showValidation = false,
}: PresentCheckinFieldsProps) {
  // Local state for editing
  const [selections, setSelections] = React.useState<ProductSelectionItem[]>(
    [],
  );
  const [selectedProductId, setSelectedProductId] = React.useState("");
  const [newProductPrice, setNewProductPrice] = React.useState("");
  const [newProductPriceRange, setNewProductPriceRange] = React.useState("");

  // Initialize from props
  React.useEffect(() => {
    if (productSelections.length > 0 && selections.length === 0) {
      const items: ProductSelectionItem[] = productSelections.map((ps) => ({
        id: Math.random().toString(36).substr(2, 9),
        product_id: ps.product_id,
        name: ps.name,
        price: ps.price,
        price_range: ps.price_range,
      }));
      setSelections(items);
    }
  }, [productSelections]);

  // Notify parent about changes
  React.useEffect(() => {
    const newSelections: ProductSelection[] = selections.map((item) => ({
      product_id: item.product_id,
      name: item.name,
      price: item.price,
      price_range: item.price_range,
    }));
    onProductSelectionsChange?.(newSelections);
  }, [selections]);

  // Validation
  const validation = React.useMemo(() => {
    const errors: string[] = [];

    // Check images
    if (!images || images.length === 0) {
      errors.push("กรุณาอัปโหลดรูปภาพอย่างน้อย 1 รูป");
    }

    // Check product selections
    if (selections.length === 0) {
      errors.push("กรุณาเพิ่มสินค้าอย่างน้อย 1 รายการ");
    } else {
      // Check for shoe and insole
      const hasShoe = selections.some((item) => {
        const product = products.find((p) => p.id === item.product_id);
        return product?.type === ProductType.SHOE;
      });

      const hasInsole = selections.some((item) => {
        const product = products.find((p) => p.id === item.product_id);
        return product?.type === ProductType.INSOLE;
      });

      if (!hasShoe || !hasInsole) {
        errors.push("กรุณาเลือกรองเท้าและแผ่นรองใน");
      }

      // Check each selection has required fields
      selections.forEach((item, index) => {
        if (!item.price_range) {
          errors.push(`รายการที่ ${index + 1}: กรุณาเลือกช่วงราคา`);
        }
        if (item.name !== NO_INSOLE_NAME && (item.price === undefined || item.price === null || item.price < 0)) {
          errors.push(`รายการที่ ${index + 1}: กรุณากรอกราคา`);
        }
      });
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
  }, [
    selections,
    images,
    deliveryDuration,
    purchaseType,
    purchaseMonths,
    competitorBrand,
    products,
  ]);

  const handleAddProduct = () => {
    if (!selectedProductId || !newProductPriceRange) return;

    const product = products.find((p) => p.id === selectedProductId);
    if (!product) return;

    const newItem: ProductSelectionItem = {
      id: Math.random().toString(36).substr(2, 9),
      product_id: selectedProductId,
      name: product.name,
      price: product.name === NO_INSOLE_NAME ? 0 : Number(newProductPrice) || 0,
      price_range: newProductPriceRange,
    };

    setSelections([...selections, newItem]);
    setSelectedProductId("");
    setNewProductPrice("");
    setNewProductPriceRange("");
  };

  const handleRemoveProduct = (id: string) => {
    setSelections(selections.filter((s) => s.id !== id));
  };

  const handlePriceChange = (id: string, price: number) => {
    setSelections(selections.map((s) => (s.id === id ? { ...s, price } : s)));
  };

  const handlePriceRangeChange = (id: string, price_range: string) => {
    setSelections(
      selections.map((s) => (s.id === id ? { ...s, price_range } : s)),
    );
  };

  const isNoInsoleProduct = (item: ProductSelectionItem): boolean => {
    return item.name === NO_INSOLE_NAME;
  };

  const selectedProductIds = selections.map((s) => s.product_id);
  const availableProducts = products.filter(
    (p) => !selectedProductIds.includes(p.id),
  );
  const isSelectedNoInsole =
    products.find((p) => p.id === selectedProductId)?.name === NO_INSOLE_NAME;

  // View mode render
  if (!isEditing) {
    return (
      <div className="space-y-6">
        {/* Product Selections */}
        {productSelections.length > 0 && (
          <div className="space-y-4">
            <Label className="text-base">สินค้าที่แนะนำ</Label>
            <div className="space-y-3">
              {productSelections.map((selection, index) => (
                <div
                  key={`${selection.product_id}-${index}`}
                  className="p-4 border rounded-lg bg-muted/50"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{selection.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ราคา: {selection.price.toLocaleString()} บาท
                      </p>
                    </div>
                    <Badge variant="secondary">
                      {PRICE_RANGES.find(
                        (r) => r.value === selection.price_range,
                      )?.label || selection.price_range}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Delivery Duration */}
        {deliveryDuration && (
          <div className="space-y-2">
            <Label>ระยะเวลาจัดส่ง</Label>
            <p className="text-sm">
              {DELIVERY_DURATIONS.find((d) => d.value === deliveryDuration)
                ?.label || deliveryDuration}
            </p>
          </div>
        )}

        {/* Purchase Type */}
        {purchaseType && (
          <div className="space-y-2">
            <Label>ประเภทรอบซื้อ</Label>
            <p className="text-sm">
              {purchaseType === "monthly" ? "ทยอย" : "ประจำปี"}
            </p>
          </div>
        )}

        {/* Purchase Months */}
        {purchaseType === "monthly" && purchaseMonths.length > 0 && (
          <div className="space-y-2">
            <Label>รอบซื้อ</Label>
            <div className="flex flex-wrap gap-1">
              {purchaseMonths.map((month) => {
                const monthLabel =
                  MONTHS.find((m) => m.value === month)?.label || month;
                return (
                  <Badge key={month} variant="secondary">
                    {monthLabel}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}

        {/* Competitor Brand */}
        {competitorBrand && (
          <div className="space-y-2">
            <Label>แบรนด์คู่แข่ง</Label>
            <p className="text-sm">{competitorBrand}</p>
          </div>
        )}

        {/* Special Requirements */}
        {specialRequirements && (
          <div className="space-y-2">
            <Label>ความต้องการพิเศษของลูกค้า</Label>
            <p className="text-sm whitespace-pre-wrap">{specialRequirements}</p>
          </div>
        )}
      </div>
    );
  }

  // Edit mode render
  return (
    <div className="space-y-6">
      {/* Validation Errors */}
      {showValidation && validation.errors.length > 0 && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 space-y-2">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span className="font-medium">กรุณากรอกข้อมูลให้ครบถ้วน</span>
          </div>
          <ul className="text-sm text-destructive list-disc list-inside">
            {validation.errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Product Selections */}
      <div className="space-y-4">
        <Label className="text-base">สินค้าที่แนะนำ *</Label>

        {/* Product List */}
        {selections.length === 0 && showValidation && (
          <div className="p-4 border border-destructive rounded-lg bg-destructive/5 text-destructive text-sm">
            กรุณาเพิ่มสินค้าอย่างน้อย 1 รายการ (รองเท้าและแผ่นรองใน)
          </div>
        )}

        <div className="space-y-4">
          {selections.map((item) => (
            <div
              key={item.id}
              className={cn(
                "p-4 border rounded-lg space-y-3",
                showValidation &&
                  (!item.price_range ||
                    (!isNoInsoleProduct(item) &&
                      (!item.price || item.price <= 0))) &&
                  "border-destructive bg-destructive/5",
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveProduct(item.id)}
                  className="h-8 w-8 p-0 text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Price */}
                <div className="space-y-1">
                  <Label className="text-xs">ราคา *</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={item.price || ""}
                      onChange={(e) =>
                        handlePriceChange(item.id, Number(e.target.value) || 0)
                      }
                      className={cn(
                        "flex-1",
                        showValidation &&
                          !isNoInsoleProduct(item) &&
                          (!item.price || item.price <= 0) &&
                          "border-destructive",
                      )}
                      min="0"
                      step="0.01"
                      disabled={isNoInsoleProduct(item)}
                      placeholder="0"
                    />
                    <span className="text-sm text-muted-foreground">บาท</span>
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-1">
                  <Label className="text-xs">ช่วงราคา *</Label>
                  <Select
                    value={item.price_range}
                    onValueChange={(value) =>
                      handlePriceRangeChange(item.id, value)
                    }
                  >
                    <SelectTrigger
                      className={cn(
                        showValidation &&
                          !item.price_range &&
                          "border-destructive",
                      )}
                    >
                      <SelectValue placeholder="เลือกช่วงราคา" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRICE_RANGES.map((range) => (
                        <SelectItem key={range.value} value={range.value}>
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Product Form */}
        <div className="p-4 border rounded-lg space-y-3">
          <Label className="text-sm">เพิ่มสินค้าใหม่</Label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* Product Select */}
            <Select
              value={selectedProductId}
              onValueChange={(value) => {
                setSelectedProductId(value);
                if (
                  products.find((p) => p.id === value)?.name === NO_INSOLE_NAME
                ) {
                  setNewProductPrice("0");
                } else {
                  setNewProductPrice("");
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="เลือกสินค้า" />
              </SelectTrigger>
              <SelectContent>
                {availableProducts.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Price */}
            <Input
              type="number"
              placeholder="ราคา"
              value={newProductPrice}
              onChange={(e) => setNewProductPrice(e.target.value)}
              min="0"
              step="0.01"
              disabled={isSelectedNoInsole}
            />

            {/* Price Range */}
            <Select
              value={newProductPriceRange}
              onValueChange={setNewProductPriceRange}
            >
              <SelectTrigger>
                <SelectValue placeholder="ช่วงราคา" />
              </SelectTrigger>
              <SelectContent>
                {PRICE_RANGES.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddProduct}
            disabled={!selectedProductId || !newProductPriceRange}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-1" />
            เพิ่มสินค้า
          </Button>
        </div>
      </div>

      {/* Delivery Duration */}
      <div className="space-y-2">
        <Label>ระยะเวลาจัดส่ง *</Label>
        <Select
          value={deliveryDuration}
          onValueChange={onDeliveryDurationChange}
        >
          <SelectTrigger
            className={cn(
              showValidation && !deliveryDuration && "border-destructive",
            )}
          >
            <SelectValue placeholder="เลือกระยะเวลาจัดส่ง" />
          </SelectTrigger>
          <SelectContent>
            {DELIVERY_DURATIONS.map((duration) => (
              <SelectItem key={duration.value} value={duration.value}>
                {duration.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Purchase Type */}
      <div className="space-y-2">
        <Label>ประเภทรอบซื้อ *</Label>
        <RadioGroup
          value={purchaseType}
          onValueChange={(value) =>
            onPurchaseTypeChange?.(value as "monthly" | "yearly")
          }
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="monthly"
              id="monthly"
              className={cn(
                showValidation && !purchaseType && "border-destructive",
              )}
            />
            <Label htmlFor="monthly" className="cursor-pointer">
              ทยอย
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="yearly"
              id="yearly"
              className={cn(
                showValidation && !purchaseType && "border-destructive",
              )}
            />
            <Label htmlFor="yearly" className="cursor-pointer">
              ประจำปี
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Purchase Months - show for both monthly and yearly */}
      {purchaseType && (
        <div className="space-y-2">
          <Label>รอบซื้อ *</Label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {MONTHS.map((month) => (
              <label
                key={month.value}
                className={cn(
                  "flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition-colors",
                  purchaseMonths.includes(month.value)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "hover:bg-muted",
                )}
              >
                <input
                  type="checkbox"
                  className="hidden"
                  checked={purchaseMonths.includes(month.value)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onPurchaseMonthsChange?.([
                        ...purchaseMonths,
                        month.value,
                      ]);
                    } else {
                      onPurchaseMonthsChange?.(
                        purchaseMonths.filter((m) => m !== month.value),
                      );
                    }
                  }}
                />
                <span className="text-sm">{month.label}</span>
              </label>
            ))}
          </div>
          {showValidation && purchaseMonths.length === 0 && (
            <p className="text-sm text-destructive">
              กรุณาเลือกรอบซื้ออย่างน้อย 1 เดือน
            </p>
          )}
        </div>
      )}

      {/* Competitor Brand */}
      <div className="space-y-2">
        <Label htmlFor="competitor-brand">แบรนด์คู่แข่ง *</Label>
        <Input
          id="competitor-brand"
          value={competitorBrand}
          onChange={(e) => onCompetitorBrandChange?.(e.target.value)}
          placeholder="กรอกแบรนด์คู่แข่ง"
          className={cn(
            showValidation && !competitorBrand.trim() && "border-destructive",
          )}
        />
      </div>
    </div>
  );
}
