import { useState, useRef } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Badge } from "@/shared/components/ui/badge";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/shared/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { ImageUploader } from '@/shared/components/ImageUploader';

const COLORS = [
  { value: "black", label: "ดำ" },
  { value: "white", label: "ขาว" },
  { value: "red", label: "แดง" },
  { value: "blue", label: "น้ำเงิน" },
  { value: "green", label: "เขียว" },
  { value: "yellow", label: "เหลือง" },
  { value: "purple", label: "ม่วง" },
  { value: "pink", label: "ชมพู" },
  { value: "brown", label: "น้ำตาล" },
  { value: "gray", label: "เทา" },
  { value: "beige", label: "เบจ" },
  { value: "navy", label: "กรมท่า" },
] as const;

interface ColorWithImage {
  color: string;
  image: string;
}

interface ColorSelectorProps {
  selectedColors: ColorWithImage[];
  onColorSelect: (color: ColorWithImage) => void;
  onColorRemove: (color: string) => void;
  customColor: string;
  onCustomColorChange: (color: string) => void;
  onCustomColorAdd: () => void;
  productId: string;
}

export function ColorSelector({
  selectedColors,
  onColorSelect,
  onColorRemove,
  customColor,
  onCustomColorChange,
  onCustomColorAdd,
  productId,
}: ColorSelectorProps) {
  const [openColorPopover, setOpenColorPopover] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

      setSelectedImage(file);

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      // Add color with image
      onColorSelect({ color: selectedColor, image: previewUrl });

      // Reset states
      setSelectedColor("");
      setShowImageUploader(false);
      setSelectedImage(null);
      setImagePreview("");
    }
  };

  const handleImageRemove = () => {
    setSelectedImage(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setShowImageUploader(true);
    setOpenColorPopover(false);
  };

  const handleCustomColorAdd = () => {
    if (customColor && !selectedColors.some(({ color }) => color === customColor)) {
      setSelectedColor(customColor);
      setShowImageUploader(true);
      onCustomColorChange("");
    }
  };

  const handleImageUploaded = (url: string) => {
    onColorSelect({ color: selectedColor, image: url });
    setShowImageUploader(false);
    setSelectedColor("");
  };

  const handleImageRemoved = () => {
    setShowImageUploader(false);
    setSelectedColor("");
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {selectedColors.map(({ color, image }) => (
          <Badge
            key={color}
            variant="secondary"
            className="flex items-center gap-1 p-2"
          >
            {image && (
              <img
                src={image}
                alt={color}
                className="w-6 h-6 rounded-full object-cover mr-1"
              />
            )}
            {color}
            <button
              type="button"
              onClick={() => onColorRemove(color)}
              className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {color}</span>
            </button>
          </Badge>
        ))}
      </div>

      {showImageUploader ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">อัปโหลดรูปภาพสำหรับสี: {selectedColor}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowImageUploader(false);
                setSelectedColor("");
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <ImageUploader
            onImageUploaded={handleImageUploaded}
            onImageRemoved={handleImageRemoved}
            maxSizeMB={5}
            bucketName="product-variants"
            folderPath={`products/${productId}/variants`}
            className="w-full"
          />
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <Popover open={openColorPopover} onOpenChange={setOpenColorPopover}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openColorPopover}
                className="w-full justify-between"
              >
                เลือกสี
                <Plus className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="ค้นหาสี..." />
                <CommandEmpty>ไม่พบสีที่ต้องการ</CommandEmpty>
                <CommandGroup>
                  {COLORS.map((color) => (
                    <CommandItem
                      key={color.value}
                      onSelect={() => handleColorSelect(color.label)}
                    >
                      {color.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="เพิ่มสีอื่นๆ"
              value={customColor}
              onChange={(e) => onCustomColorChange(e.target.value)}
              className="bg-background h-10"
            />
            <Button
              type="button"
              onClick={handleCustomColorAdd}
              disabled={!customColor}
              className="h-10"
            >
              เพิ่ม
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 