import * as React from "react";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Clock } from "lucide-react";

interface PresentTimeFieldProps {
  value: string;
  onChange: (value: string) => void;
  showValidation?: boolean;
  label?: string;
}

// Generate hours (00-23)
const HOURS = Array.from({ length: 24 }, (_, i) => ({
  value: i.toString().padStart(2, '0'),
  label: i.toString().padStart(2, '0'),
}));

// Generate minutes (00-59)
const MINUTES = Array.from({ length: 60 }, (_, i) => ({
  value: i.toString().padStart(2, '0'),
  label: i.toString().padStart(2, '0'),
}));

export function PresentTimeField({ value, onChange, showValidation = false, label = "เวลานัดหมาย" }: PresentTimeFieldProps) {
  // Parse value (HH:mm format)
  const [hours, minutes] = React.useMemo(() => {
    if (!value) return ['', ''];
    const parts = value.split(':');
    return [parts[0] || '', parts[1] || ''];
  }, [value]);

  const handleHoursChange = (newHours: string) => {
    const newMinutes = minutes || '00';
    onChange(`${newHours}:${newMinutes}`);
  };

  const handleMinutesChange = (newMinutes: string) => {
    const newHours = hours || '09';
    onChange(`${newHours}:${newMinutes}`);
  };

  const isInvalid = showValidation && !value;

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <Select value={hours} onValueChange={handleHoursChange}>
          <SelectTrigger className="w-20" aria-invalid={isInvalid && !hours}>
            <SelectValue placeholder="ชม." />
          </SelectTrigger>
          <SelectContent>
            {HOURS.map((hour) => (
              <SelectItem key={hour.value} value={hour.value}>
                {hour.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-lg font-medium">:</span>
        <Select value={minutes} onValueChange={handleMinutesChange}>
          <SelectTrigger className="w-20" aria-invalid={isInvalid && !minutes}>
            <SelectValue placeholder="นาที" />
          </SelectTrigger>
          <SelectContent>
            {MINUTES.map((minute) => (
              <SelectItem key={minute.value} value={minute.value}>
                {minute.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">น.</span>
      </div>
      {isInvalid && (
        <p className="text-sm text-destructive">กรุณาเลือก{label}</p>
      )}
    </div>
  );
}
