import { Label } from "@/shared/components/ui/label";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { PROBLEM_TYPES } from "@/shared/constants/eventSubTypes";

interface ProblemTypeFieldProps {
  value: string[];
  onChange: (value: string[]) => void;
  showValidation?: boolean;
}

export function ProblemTypeField({ value, onChange, showValidation = false }: ProblemTypeFieldProps) {
  const isInvalid = showValidation && value.length === 0;

  const handleToggle = (typeValue: string) => {
    if (value.includes(typeValue)) {
      onChange(value.filter(v => v !== typeValue));
    } else {
      onChange([...value, typeValue]);
    }
  };

  return (
    <div className="space-y-2">
      <Label>ประเภทปัญหา *</Label>
      <div className={`grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 rounded-md border ${isInvalid ? 'border-destructive' : 'border-input'}`}>
        {PROBLEM_TYPES.map((type) => (
          <label
            key={type.value}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Checkbox
              checked={value.includes(type.value)}
              onCheckedChange={() => handleToggle(type.value)}
            />
            <span className="text-sm">{type.label}</span>
          </label>
        ))}
      </div>
      {isInvalid && (
        <p className="text-sm text-destructive">กรุณาเลือกประเภทปัญหาอย่างน้อย 1 รายการ</p>
      )}
    </div>
  );
}
