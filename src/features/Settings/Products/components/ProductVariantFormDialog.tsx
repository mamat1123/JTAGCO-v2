import { useState, useRef, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { ProductVariant, CreateProductVariantDTO, Product, ProductType } from '@/entities/Product/product';
import { productAPI } from '@/entities/Product/productAPI';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/shared/components/ui/radio-group"

// Import components
import { SizeRangeInput } from './ProductVariant/SizeRangeInput';
import { ColorSelector } from './ProductVariant/ColorSelector';
import { ImageUploader } from '@/shared/components/ImageUploader';
import { SteelPlateSelector } from './ProductVariant/SteelPlateSelector';
import { InsoleSelector } from './ProductVariant/InsoleSelector';
import { AttributeList } from './ProductVariant/AttributeList';
import { ProductTypeSelector } from './ProductVariant/ProductTypeSelector';

// Types
interface ProductVariantFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateProductVariantDTO) => void;
  editingVariant: ProductVariant | null;
  productId: string;
  initialData?: Partial<CreateProductVariantDTO>;
  isLoading?: boolean;
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
  editingVariant,
  productId,
  initialData,
  isLoading = false,
}: ProductVariantFormDialogProps) {
  const [formData, setFormData] = useState<Partial<CreateProductVariantDTO>>(
    initialData || {
      product_id: productId,
      sku: '',
      attributes: {
      },
      is_made_to_order: false,
      price: 0,
      stock: 0,
    }
  );

  const [selectedAttributeType, setSelectedAttributeType] = useState<string>("");
  const [attributeValue, setAttributeValue] = useState<string>("");
  const [customAttributeKey, setCustomAttributeKey] = useState<string>("");
  const [isCustomAttribute, setIsCustomAttribute] = useState<boolean>(false);
  const [sizeRange, setSizeRange] = useState<{ min: number; max: number }>({ min: 0, max: 0 });
  const [selectedColors, setSelectedColors] = useState<ColorWithImage[]>([]);
  const [customColor, setCustomColor] = useState("");
  const [steelPlateValue, setSteelPlateValue] = useState<string>("");
  const [selectedInsoles, setSelectedInsoles] = useState<string[]>([]);
  const [insoleProducts, setInsoleProducts] = useState<Product[]>([]);

  // Fetch insole products
  useEffect(() => {
    const fetchInsoleProducts = async () => {
      try {
        const products = await productAPI.getProducts();
        const insoles = products.filter(product => product.type === ProductType.INSOLE);
        setInsoleProducts(insoles);
      } catch (error) {
        console.error('Failed to fetch insole products:', error);
      }
    };

    if (selectedAttributeType === 'insole') {
      fetchInsoleProducts();
    }
  }, [selectedAttributeType]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
    setSelectedInsoles([]);
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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('กรุณาเลือกไฟล์รูปภาพเท่านั้น (JPEG, PNG, GIF, WEBP)');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('ขนาดไฟล์ต้องไม่เกิน 5MB');
        return;
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        attributes: {
          ...prev.attributes,
          image: previewUrl
        }
      }));
    }
  };

  const handleImageRemove = () => {
    setFormData(prev => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        image: undefined
      }
    }));
  };

  const handleInsoleSelect = (insoleId: string) => {
    setSelectedInsoles(prev =>
      prev.includes(insoleId)
        ? prev.filter(id => id !== insoleId)
        : [...prev, insoleId]
    );
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
    } else if (selectedAttributeType === "insole") {
      if (selectedInsoles.length === 0) return;

      const selectedInsoleNames = selectedInsoles
        .map(id => insoleProducts.find(p => p.id === id)?.name)
        .filter(Boolean)
        .join(', ');

      newAttributes.has_insole = true;
      newAttributes.insoles = selectedInsoleNames;
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

  const handleImageUploaded = (url: string) => {
    setFormData(prev => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        image: url
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
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          เพิ่มตัวแปรสินค้า
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">เพิ่มตัวแปรสินค้าใหม่</DialogTitle>
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
                      {/* <SelectItem value="insole">รองรับการเสริมแผ่นรองในรองเท้า</SelectItem> */}
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

                  {selectedAttributeType === "insole" && (
                    <InsoleSelector
                      selectedInsoles={selectedInsoles}
                      insoleProducts={insoleProducts}
                      onInsoleSelect={handleInsoleSelect}
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

                  {!isCustomAttribute && selectedAttributeType && !["size", "color", "image", "steel_plate", "insole"].includes(selectedAttributeType) && (
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
                  <Button
                    type="button"
                    size="icon"
                    onClick={handleAddAttribute}
                    disabled={
                      !selectedAttributeType ||
                      (selectedAttributeType === "size" ? (sizeRange.min === 0 || sizeRange.max === 0 || sizeRange.min > sizeRange.max) :
                        selectedAttributeType === "color" ? selectedColors.length === 0 :
                          selectedAttributeType === "image" ? !formData.attributes?.image :
                            selectedAttributeType === "steel_plate" ? !steelPlateValue :
                              selectedAttributeType === "insole" ? selectedInsoles.length === 0 :
                                isCustomAttribute ? (!customAttributeKey || !attributeValue) :
                                  !attributeValue)
                    }
                    className="bg-primary hover:bg-primary/90 h-10 w-10"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
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
            {isLoading ? 'กำลังดำเนินการ...' : editingVariant ? 'อัปเดต' : 'เพิ่ม'} ตัวแปรสินค้า
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}