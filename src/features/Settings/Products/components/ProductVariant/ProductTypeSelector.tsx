import { Label } from "@/shared/components/ui/label"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/shared/components/ui/radio-group"

interface ProductTypeSelectorProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

export function ProductTypeSelector({
  value,
  onChange,
}: ProductTypeSelectorProps) {
  return (
    <div className="space-y-3 p-3 sm:p-4 bg-muted/50 rounded-lg border">
      <Label className="text-sm font-medium">ประเภทสินค้า</Label>
      <RadioGroup
        value={value ? "made_to_order" : "ready_made"}
        onValueChange={(value: "made_to_order" | "ready_made") =>
          onChange(value === "made_to_order")
        }
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
      >
        <div>
          <RadioGroupItem
            value="ready_made"
            id="ready_made"
            className="peer sr-only"
          />
          <Label
            htmlFor="ready_made"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-background p-3 sm:p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer min-h-[120px]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mb-2 sm:mb-3 h-5 w-5 sm:h-6 sm:w-6"
            >
              <path d="M20 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2Z" />
              <path d="M8 2v4" />
              <path d="M16 2v4" />
              <path d="M2 10h20" />
            </svg>
            สินค้าสำเร็จรูป
          </Label>
        </div>
        <div>
          <RadioGroupItem
            value="made_to_order"
            id="made_to_order"
            className="peer sr-only"
          />
          <Label
            htmlFor="made_to_order"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-background p-3 sm:p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer min-h-[120px]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mb-2 sm:mb-3 h-5 w-5 sm:h-6 sm:w-6"
            >
              <path d="M12 2v20" />
              <path d="M2 12h20" />
              <path d="m4.93 4.93 14.14 14.14" />
              <path d="m19.07 4.93-14.14 14.14" />
            </svg>
            สินค้าผลิต
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
} 