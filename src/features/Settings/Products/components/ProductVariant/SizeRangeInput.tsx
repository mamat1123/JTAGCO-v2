import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

interface SizeRangeInputProps {
  minSize: string;
  maxSize: string;
  onMinSizeChange: (value: string) => void;
  onMaxSizeChange: (value: string) => void;
}

export function SizeRangeInput({
  minSize,
  maxSize,
  onMinSizeChange,
  onMaxSizeChange,
}: SizeRangeInputProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="minSize">ขนาดต่ำสุด</Label>
        <Input
          id="minSize"
          type="number"
          value={minSize}
          onChange={(e) => onMinSizeChange(e.target.value)}
          placeholder="เช่น 36"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="maxSize">ขนาดสูงสุด</Label>
        <Input
          id="maxSize"
          type="number"
          value={maxSize}
          onChange={(e) => onMaxSizeChange(e.target.value)}
          placeholder="เช่น 42"
        />
      </div>
    </div>
  );
} 