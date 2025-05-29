import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Separator } from "@/shared/components/ui/separator";
import { EventMainType } from "@/shared/types/events";
import { EventSubType } from "../services/eventSubTypeService";

interface EventTypeSelectorProps {
  mainTypes: EventMainType[];
  subTypes: EventSubType[];
  isLoadingMainTypes: boolean;
  isLoadingSubTypes: boolean;
  selectedMainType: string;
  selectedSubType: string;
  onMainTypeChange: (value: string) => void;
  onSubTypeChange: (value: string) => void;
}

export function EventTypeSelector({
  mainTypes,
  subTypes,
  isLoadingMainTypes,
  isLoadingSubTypes,
  selectedMainType,
  selectedSubType,
  onMainTypeChange,
  onSubTypeChange,
}: EventTypeSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        <div className="space-y-2 w-full sm:w-1/2">
          <Label htmlFor="main_type_id">ประเภทหลัก</Label>
          <Select
            value={selectedMainType}
            onValueChange={onMainTypeChange}
            disabled={isLoadingMainTypes}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={isLoadingMainTypes ? "กำลังโหลด..." : "เลือกประเภทหลัก"}
              />
            </SelectTrigger>
            <SelectContent>
              {mainTypes.map((type) => (
                <SelectItem key={type.id} value={type.id.toString()}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 w-full sm:w-1/2">
          <Label htmlFor="sub_type_id">ประเภทย่อย</Label>
          <Select
            value={selectedSubType}
            onValueChange={onSubTypeChange}
            disabled={isLoadingSubTypes || !selectedMainType}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={
                  isLoadingSubTypes
                    ? "กำลังโหลด..."
                    : !selectedMainType
                    ? "เลือกประเภทหลักก่อน"
                    : "เลือกประเภทย่อย"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {subTypes.map((type) => (
                <SelectItem key={type.id} value={type.id.toString()}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Separator />
    </div>
  );
} 