import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { BusinessTypeDto } from "@/entities/BusinessType/businessType";

interface BasicInfoFormProps {
  name: string;
  tax_id: string;
  business_type_id?: number;
  business_type_detail?: string;
  branch: string;
  order_cycle: number;
  email?: string;
  credit: number;
  businessTypes: BusinessTypeDto[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBusinessTypeChange: (value: string) => void;
  onBusinessTypeDetailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function BasicInfoForm({
  name,
  tax_id,
  business_type_id,
  business_type_detail,
  branch,
  order_cycle,
  email,
  credit,
  businessTypes,
  onChange,
  onBusinessTypeChange,
  onBusinessTypeDetailChange,
}: BasicInfoFormProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">ข้อมูลพื้นฐาน</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">ชื่อบริษัท</Label>
          <Input
            id="name"
            name="name"
            value={name}
            onChange={onChange}
            required
            placeholder="กรอกชื่อบริษัท"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tax_id">เลขประจำตัวผู้เสียภาษี</Label>
          <Input
            id="tax_id"
            name="tax_id"
            value={tax_id}
            onChange={onChange}
            placeholder="กรอกเลขประจำตัวผู้เสียภาษี"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="business_type_id">ประเภทธุรกิจ</Label>
          <Select
            value={business_type_id?.toString() || ''}
            onValueChange={onBusinessTypeChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="เลือกประเภทธุรกิจ" />
            </SelectTrigger>
            <SelectContent>
              {businessTypes.map((type) => (
                <SelectItem key={type.id} value={type.id.toString()}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {business_type_id === 99 && (
          <div className="space-y-2">
            <Label htmlFor="business_type_detail">รายละเอียดประเภทธุรกิจ</Label>
            <Input
              id="business_type_detail"
              name="business_type_detail"
              value={business_type_detail}
              onChange={onBusinessTypeDetailChange}
              required
              placeholder="กรอกรายละเอียดประเภทธุรกิจ"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="branch">สาขา</Label>
          <Input
            id="branch"
            name="branch"
            value={branch}
            onChange={onChange}
            placeholder="กรอกสาขา"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">อีเมล</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={onChange}
            placeholder="กรอกอีเมล"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="credit">เครดิต</Label>
          <Input
            id="credit"
            name="credit"
            type="number"
            value={credit}
            onChange={onChange}
            placeholder="กรอกเครดิต"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="credit">รอบการจัดส่ง</Label>
          <Input
            id="order_cycle"
            name="order_cycle"
            type="number"
            value={order_cycle}
            onChange={onChange}
            placeholder="กรอกรอบการจัดส่ง"
          />
        </div>
      </div>
    </div>
  );
} 