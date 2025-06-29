import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { CreateProductVariantDTO } from '@/entities/Product/product';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip"

// Import components
import { SizeRangeInput } from './ProductVariant/SizeRangeInput';
import { ColorSelector } from './ProductVariant/ColorSelector';
import { ImageUploader } from '@/shared/components/ImageUploader';
import { SteelPlateSelector } from './ProductVariant/SteelPlateSelector';
import { AttributeList } from './ProductVariant/AttributeList';
import { ProductTypeSelector } from './ProductVariant/ProductTypeSelector';

// Types
interface ProductVariantFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateProductVariantDTO) => void;
  productId: string;
  isLoading?: boolean;
  productName: string;
}

interface ColorWithImage {
  color: string;
  image: string;
}

// Main Component
export function ProductVariantFormDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  productId,
  isLoading = false,
  productName,
}: ProductVariantFormDialogProps) {
  const [formData, setFormData] = useState<Partial<CreateProductVariantDTO>>({
    product_id: productId,
    sku: '',
    attributes: {},
    is_made_to_order: false,
    price: 0,
    stock: 0,
  });

  const [selectedAttributeType, setSelectedAttributeType] = useState<string>("");
  const [attributeValue, setAttributeValue] = useState<string>("");
  const [customAttributeKey, setCustomAttributeKey] = useState<string>("");
  const [isCustomAttribute, setIsCustomAttribute] = useState<boolean>(false);
  const [sizeRange, setSizeRange] = useState<{ min: number; max: number }>({ min: 0, max: 0 });
  const [selectedColors, setSelectedColors] = useState<ColorWithImage[]>([]);
  const [customColor, setCustomColor] = useState("");
  const [steelPlateValue, setSteelPlateValue] = useState<string>("");
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [hasUnsavedAttributes, setHasUnsavedAttributes] = useState(false);

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  // Add useEffect to update productId in formData when productId prop changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      product_id: productId
    }));
  }, [productId]);


  // Handle modal close
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Reset all form data when modal is closed
      resetForm();
    }
    onOpenChange(open);
  };

  // Add reset function to clear all form data
  const resetForm = () => {
    setFormData({
      product_id: productId,
      sku: '',
      attributes: {},
      is_made_to_order: false,
      price: 0,
      stock: 0,
    });
    setSelectedAttributeType("");
    setAttributeValue("");
    setCustomAttributeKey("");
    setIsCustomAttribute(false);
    setSizeRange({ min: 0, max: 0 });
    setSelectedColors([]);
    setCustomColor("");
    setSteelPlateValue("");
    setShowUnsavedModal(false);
    setHasUnsavedAttributes(false);
  };

  // Add this function to check for unsaved attributes
  const checkUnsavedAttributes = () => {
    return (
      selectedAttributeType !== "" &&
      ((selectedAttributeType === "size" && (sizeRange.min !== 0 || sizeRange.max !== 0)) ||
        (selectedAttributeType === "color" && selectedColors.length > 0) ||
        (selectedAttributeType === "image" && formData.attributes?.image) ||
        (selectedAttributeType === "steel_plate" && steelPlateValue !== "") ||
        (isCustomAttribute && (customAttributeKey !== "" || attributeValue !== "")) ||
        (!isCustomAttribute && attributeValue !== ""))
    );
  };

  // Update hasUnsavedAttributes whenever relevant states change
  useEffect(() => {
    setHasUnsavedAttributes(checkUnsavedAttributes());
  }, [
    selectedAttributeType,
    sizeRange,
    selectedColors,
    formData.attributes?.image,
    steelPlateValue,
    customAttributeKey,
    attributeValue,
    isCustomAttribute
  ]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (hasUnsavedAttributes) {
      setShowUnsavedModal(true);
      return;
    }
    onSubmit(formData as CreateProductVariantDTO);
    handleOpenChange(false);
  };

  const handleConfirmSubmit = () => {
    setShowUnsavedModal(false);
    onSubmit(formData as CreateProductVariantDTO);
  };

  const handleAttributeTypeChange = (value: string) => {
    setSelectedAttributeType(value);
    setIsCustomAttribute(value === "other");
    setAttributeValue("");
    setCustomAttributeKey("");
    setSizeRange({ min: 0, max: 0 });
    setSelectedColors([]);
    setCustomColor("");
    setSteelPlateValue("");
  };

  const handleSizeRangeChange = (type: 'min' | 'max', value: string) => {
    const numValue = parseInt(value) || 0;
    setSizeRange(prev => ({
      ...prev,
      [type]: numValue
    }));
  };

  const handleColorSelect = (colorWithImage: ColorWithImage) => {
    setSelectedColors(prev => [...prev, colorWithImage]);
  };

  const handleColorRemove = (colorToRemove: string) => {
    setSelectedColors(prev => prev.filter(({ color }) => color !== colorToRemove));
  };

  const handleCustomColorAdd = () => {
    if (customColor && !selectedColors.some(({ color }) => color === customColor)) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const previewUrl = URL.createObjectURL(file);
          setSelectedColors(prev => [...prev, { 
            color: customColor, 
            image: previewUrl
          }]);
          setCustomColor("");
        }
      };
      input.click();
    }
  };

  const handleAddAttribute = () => {
    if (!selectedAttributeType) return;

    let newAttributes = { ...formData.attributes };

    if (selectedAttributeType === "size") {
      if (sizeRange.min === 0 || sizeRange.max === 0) return;
      if (sizeRange.min > sizeRange.max) return;

      newAttributes.size = `${sizeRange.min} - ${sizeRange.max}`;
    } else if (selectedAttributeType === "color") {
      if (selectedColors.length === 0) return;
      newAttributes.colors = selectedColors;
    } else if (selectedAttributeType === "image") {
      if (!formData.attributes?.image) return;
    } else if (selectedAttributeType === "steel_plate") {
      if (!steelPlateValue) return;
      newAttributes.steel_plate = steelPlateValue;
    } else if (isCustomAttribute) {
      if (!customAttributeKey || !attributeValue) return;
      newAttributes[customAttributeKey] = attributeValue;
    } else {
      if (!attributeValue) return;
      newAttributes[selectedAttributeType] = attributeValue;
    }

    setFormData(prev => ({
      ...prev,
      attributes: newAttributes
    }));

    // Reset form
    handleAttributeTypeChange("");
  };

  const handleRemoveAttribute = (key: string) => {
    setFormData(prev => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [key]: undefined
      }
    }));
  };

  const handleImageUploaded = (urls: string[]) => {
    setFormData(prev => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        image: urls[0]
      }
    }));
  };

  const handleImageRemoved = () => {
    setFormData(prev => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        image: undefined
      }
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          เพิ่มตัวแปรสินค้า
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">เพิ่มตัวแปรสินค้าใหม่ ({productName})</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ตัวเลือกสินค้า */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">ตัวเลือกสินค้า</h3>
              <span className="text-sm text-muted-foreground">
                {Object.keys(formData.attributes || {}).filter(key => formData.attributes?.[key]).length} ตัวเลือก
              </span>
            </div>

            <div className="space-y-4 p-3 sm:p-4 bg-muted/50 rounded-lg border">
              <div className="space-y-3">
                <Label className="text-sm font-medium">เพิ่มตัวเลือกสินค้า</Label>
                <div className='space-y-3'>
                  <Select value={selectedAttributeType} onValueChange={handleAttributeTypeChange}>
                    <SelectTrigger className="w-full bg-background h-10">
                      <SelectValue placeholder="เลือกตัวเลือก" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="size">ขนาด</SelectItem>
                      <SelectItem value="color">สี</SelectItem>
                      <SelectItem value="steel_plate">รองรับการเสริมแผ่นเหล็ก</SelectItem>
                      <SelectItem value="other">อื่นๆ</SelectItem>
                    </SelectContent>
                  </Select>

                  {selectedAttributeType === "size" && (
                    <SizeRangeInput
                      minSize={sizeRange.min.toString()}
                      maxSize={sizeRange.max.toString()}
                      onMinSizeChange={(value) => handleSizeRangeChange('min', value)}
                      onMaxSizeChange={(value) => handleSizeRangeChange('max', value)}
                    />
                  )}

                  {selectedAttributeType === "color" && (
                    <ColorSelector
                      selectedColors={selectedColors}
                      onColorSelect={handleColorSelect}
                      onColorRemove={handleColorRemove}
                      customColor={customColor}
                      onCustomColorChange={setCustomColor}
                      onCustomColorAdd={handleCustomColorAdd}
                      productId={productId}
                    />
                  )}

                  {selectedAttributeType === "image" && (
                    <ImageUploader
                      onImageUploaded={handleImageUploaded}
                      onImageRemoved={handleImageRemoved}
                      maxSizeMB={5}
                      bucketName="product-variants"
                      folderPath={`products/${productId}/variants`}
                      className="w-full"
                    />
                  )}

                  {selectedAttributeType === "steel_plate" && (
                    <SteelPlateSelector
                      value={steelPlateValue}
                      onChange={setSteelPlateValue}
                    />
                  )}

                  {isCustomAttribute && (
                    <div className="space-y-3">
                      <Input
                        type="text"
                        placeholder="ระบุชื่อตัวเลือก (เช่น: วัสดุ, ลวดลาย)"
                        value={customAttributeKey}
                        onChange={(e) => setCustomAttributeKey(e.target.value)}
                        className="bg-background h-10"
                      />
                      <Input
                        type="text"
                        placeholder="ระบุค่า"
                        value={attributeValue}
                        onChange={(e) => setAttributeValue(e.target.value)}
                        className="bg-background h-10"
                      />
                    </div>
                  )}

                  {!isCustomAttribute && selectedAttributeType && !["size", "color", "image", "steel_plate"].includes(selectedAttributeType) && (
                    <Input
                      type="text"
                      placeholder="ระบุค่า"
                      value={attributeValue}
                      onChange={(e) => setAttributeValue(e.target.value)}
                      className="bg-background h-10"
                    />
                  )}
                </div>
                <div className='flex justify-end'>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          onClick={handleAddAttribute}
                          disabled={
                            !selectedAttributeType ||
                            (selectedAttributeType === "size" ? (sizeRange.min === 0 || sizeRange.max === 0 || sizeRange.min > sizeRange.max) :
                              selectedAttributeType === "color" ? selectedColors.length === 0 :
                                selectedAttributeType === "image" ? !formData.attributes?.image :
                                  selectedAttributeType === "steel_plate" ? !steelPlateValue :
                                    isCustomAttribute ? (!customAttributeKey || !attributeValue) :
                                      !attributeValue)
                          }
                          className="w-full bg-primary hover:bg-primary/90 h-12 px-6 gap-2 text-white font-medium text-base shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                          <Plus className="w-5 h-5" />
                          บันทึกตัวเลือกสินค้า
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>คลิกเพื่อบันทึกตัวเลือกสินค้าที่เลือกไว้</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>

            <AttributeList
              attributes={formData.attributes || {}}
              onRemoveAttribute={handleRemoveAttribute}
            />
          </div>

          {/* ราคาสินค้า */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-medium">ราคา</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price || ''}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, price: Number(e.target.value) }))
                }
                required
                className="bg-background h-10"
              />
            </div>

            <ProductTypeSelector
              value={formData.is_made_to_order ?? false}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, is_made_to_order: value }))
              }
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 h-10"
            disabled={isLoading}
          >
            {isLoading ? 'กำลังดำเนินการ...' : 'เพิ่ม'} ตัวแปรสินค้า
          </Button>
        </form>
      </DialogContent>

      {/* Add this new Dialog for unsaved attributes */}
      <Dialog open={showUnsavedModal} onOpenChange={setShowUnsavedModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">มีตัวเลือกที่ยังไม่ได้บันทึก</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">
              คุณมีตัวเลือกที่เลือกไว้แต่ยังไม่ได้บันทึก คุณต้องการดำเนินการต่อหรือไม่?
            </p>
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowUnsavedModal(false)}
              className="w-full sm:w-auto"
            >
              ยกเลิก
            </Button>
            <Button
              onClick={handleConfirmSubmit}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90"
            >
              ดำเนินการต่อ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}