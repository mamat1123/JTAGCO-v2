import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { Label } from "@/shared/components/ui/label";

interface SteelPlateSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function SteelPlateSelector({
  value,
  onChange,
}: SteelPlateSelectorProps) {
  return (
    <RadioGroup
      value={value}
      onValueChange={onChange}
      className="flex flex-col space-y-1"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="yes" id="steel-yes" />
        <Label htmlFor="steel-yes">รองรับการเสริมแผ่นเหล็ก</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="no" id="steel-no" />
        <Label htmlFor="steel-no">ไม่รองรับการเสริมแผ่นเหล็ก</Label>
      </div>
    </RadioGroup>
  );
} 