import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { PROBLEM_TYPES } from "@/shared/constants/eventSubTypes";

interface ProblemTypeFieldProps {
  value: string;
  onChange: (value: string) => void;
  showValidation?: boolean;
}

export function ProblemTypeField({ value, onChange, showValidation = false }: ProblemTypeFieldProps) {
  const isInvalid = showValidation && !value;

  return (
    <div className="space-y-2">
      <Label htmlFor="problem_type">ประเภทปัญหา</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full" aria-invalid={isInvalid}>
          <SelectValue placeholder="เลือกประเภทปัญหา" />
        </SelectTrigger>
        <SelectContent>
          {PROBLEM_TYPES.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isInvalid && (
        <p className="text-sm text-destructive">กรุณาเลือกประเภทปัญหา</p>
      )}
    </div>
  );
}
