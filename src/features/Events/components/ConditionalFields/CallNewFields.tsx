import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { MONTHS } from "@/shared/constants/eventSubTypes";

interface CallNewFieldsProps {
  businessType: string;
  shoeOrderQuantity: number | undefined;
  hasAppointment: boolean | undefined;
  purchaseMonths: string[];
  onBusinessTypeChange: (value: string) => void;
  onShoeOrderQuantityChange: (value: number | undefined) => void;
  onHasAppointmentChange: (value: boolean) => void;
  onPurchaseMonthsChange: (value: string[]) => void;
  showValidation?: boolean;
}

export function CallNewFields({
  businessType,
  shoeOrderQuantity,
  hasAppointment,
  purchaseMonths,
  onBusinessTypeChange,
  onShoeOrderQuantityChange,
  onHasAppointmentChange,
  onPurchaseMonthsChange,
  showValidation = false,
}: CallNewFieldsProps) {
  const handleMonthToggle = (monthValue: string) => {
    if (purchaseMonths.includes(monthValue)) {
      onPurchaseMonthsChange(purchaseMonths.filter(m => m !== monthValue));
    } else {
      onPurchaseMonthsChange([...purchaseMonths, monthValue]);
    }
  };

  const isBusinessTypeInvalid = showValidation && !businessType;
  const isShoeOrderQuantityInvalid = showValidation && (shoeOrderQuantity === undefined || shoeOrderQuantity === null || shoeOrderQuantity < 0);
  const isHasAppointmentInvalid = showValidation && hasAppointment === undefined;
  const isPurchaseMonthsInvalid = showValidation && hasAppointment !== undefined && purchaseMonths.length === 0;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="business_type">ประเภทธุรกิจ</Label>
        <Input
          id="business_type"
          type="text"
          value={businessType}
          onChange={(e) => onBusinessTypeChange(e.target.value)}
          placeholder="กรอกประเภทธุรกิจ"
          aria-invalid={isBusinessTypeInvalid}
        />
        {isBusinessTypeInvalid && (
          <p className="text-sm text-destructive">กรุณากรอกประเภทธุรกิจ</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="shoe_order_quantity">จำนวนรองเท้าที่สั่ง (คู่)</Label>
        <Input
          id="shoe_order_quantity"
          type="number"
          value={shoeOrderQuantity ?? ""}
          onChange={(e) => {
            const val = e.target.value;
            onShoeOrderQuantityChange(val === "" ? undefined : Number(val));
          }}
          placeholder="กรอกจำนวนรองเท้าที่สั่ง"
          min="0"
          aria-invalid={isShoeOrderQuantityInvalid}
        />
        {isShoeOrderQuantityInvalid && (
          <p className="text-sm text-destructive">กรุณากรอกจำนวนรองเท้าที่สั่ง</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>ได้นัดหมาย</Label>
        <RadioGroup
          value={hasAppointment === undefined ? "" : hasAppointment ? "yes" : "no"}
          onValueChange={(value) => onHasAppointmentChange(value === "yes")}
          className={`flex gap-4 ${isHasAppointmentInvalid ? 'p-2 border border-destructive rounded-md' : ''}`}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="appointment_yes" />
            <Label htmlFor="appointment_yes" className="font-normal cursor-pointer">ได้</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="appointment_no" />
            <Label htmlFor="appointment_no" className="font-normal cursor-pointer">ไม่ได้</Label>
          </div>
        </RadioGroup>
        {isHasAppointmentInvalid && (
          <p className="text-sm text-destructive">กรุณาเลือกว่าได้นัดหมายหรือไม่</p>
        )}
      </div>

      {hasAppointment !== undefined && (
        <div className="space-y-2">
          <Label>รอบการสั่งซื้อ</Label>
          <div className={`grid grid-cols-3 sm:grid-cols-4 gap-2 ${isPurchaseMonthsInvalid ? 'p-2 border border-destructive rounded-md' : ''}`}>
            {MONTHS.map((month) => (
              <div key={month.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`month_${month.value}`}
                  checked={purchaseMonths.includes(month.value)}
                  onCheckedChange={() => handleMonthToggle(month.value)}
                />
                <Label
                  htmlFor={`month_${month.value}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {month.label}
                </Label>
              </div>
            ))}
          </div>
          {isPurchaseMonthsInvalid && (
            <p className="text-sm text-destructive">กรุณาเลือกรอบการสั่งซื้อ</p>
          )}
        </div>
      )}
    </div>
  );
}
