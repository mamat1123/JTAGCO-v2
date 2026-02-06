import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";
import { Label } from "@/shared/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { cn } from "@/shared/lib/utils";

interface DateSelectorProps {
  date: Date;
  onDateChange: (date: Date) => void;
  testDateRange?: {
    from: Date | undefined;
    to?: Date | undefined;
  };
  onTestDateRangeChange?: (range: { from: Date | undefined; to?: Date | undefined }) => void;
  showTestDateRange?: boolean;
  minDate?: Date;
}

export function DateSelector({
  date,
  onDateChange,
  testDateRange,
  onTestDateRangeChange,
  showTestDateRange = false,
  minDate,
}: DateSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
      <div className="space-y-2">
        <Label htmlFor="scheduled_at">วันที่</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full sm:w-[240px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP", { locale: th }) : <span>เลือกวันที่</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && onDateChange(newDate)}
              initialFocus
              locale={th}
              disabled={minDate ? { before: minDate } : undefined}
            />
          </PopoverContent>
        </Popover>
      </div>

      {showTestDateRange && testDateRange && onTestDateRangeChange && (
        <div className="space-y-2">
          <Label>ช่วงเวลาทดสอบ</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full sm:w-[300px] justify-start text-left font-normal",
                  !testDateRange.from && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {testDateRange.from ? (
                  testDateRange.to ? (
                    <>
                      {format(testDateRange.from, "PPP", { locale: th })} -{" "}
                      {format(testDateRange.to, "PPP", { locale: th })}
                    </>
                  ) : (
                    format(testDateRange.from, "PPP", { locale: th })
                  )
                ) : (
                  <span>เลือกช่วงเวลาทดสอบ</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={{
                  from: testDateRange.from,
                  to: testDateRange.to,
                }}
                onSelect={(range) => {
                  if (range) {
                    onTestDateRangeChange(range);
                  }
                }}
                initialFocus
                locale={th}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
} 