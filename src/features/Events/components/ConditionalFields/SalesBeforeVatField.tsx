import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";

interface SalesBeforeVatFieldProps {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  showValidation?: boolean;
}

export function SalesBeforeVatField({ value, onChange, showValidation = false }: SalesBeforeVatFieldProps) {
  const isInvalid = showValidation && (!value || value <= 0);

  return (
    <div className="space-y-2">
      <Label htmlFor="sales_before_vat">ยอดขาย ก่อน Vat</Label>
      <Input
        id="sales_before_vat"
        type="number"
        value={value ?? ""}
        onChange={(e) => {
          const val = e.target.value;
          onChange(val === "" ? undefined : Number(val));
        }}
        placeholder="กรอกยอดขาย ก่อน Vat"
        min="0"
        aria-invalid={isInvalid}
      />
      {isInvalid && (
        <p className="text-sm text-destructive">กรุณากรอกยอดขาย ก่อน Vat</p>
      )}
    </div>
  );
}
