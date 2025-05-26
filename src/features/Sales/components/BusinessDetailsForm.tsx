import { Label } from '@/shared/components/ui/label';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';

interface BusinessDetailsFormProps {
  detail: string | null;
  jobDescription: string | null;
  totalEmployees: number | null;
  orderCycle: number | null;
  previousModel: string | null;
  competitorDetails: string | null;
  oldPrice: number | null;
  issuesEncounteredList: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function BusinessDetailsForm({
  detail,
  jobDescription,
  totalEmployees,
  orderCycle,
  previousModel,
  competitorDetails,
  oldPrice,
  issuesEncounteredList,
  onChange,
}: BusinessDetailsFormProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">

      <div className="space-y-2">
        <Label htmlFor="detail">ข้อมูลบริษัท</Label>
        <Textarea
          id="detail"
          name="detail"
          value={detail || ''}
          onChange={onChange}
          placeholder="กรอกข้อมูลบริษัท"
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="job_description">รายละเอียดงาน</Label>
        <Textarea
          id="job_description"
          name="job_description"
          value={jobDescription || ''}
          onChange={onChange}
          placeholder="กรอกรายละเอียดงาน"
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="total_employees">จำนวนพนักงานทั้งหมด</Label>
        <Input
          id="total_employees"
          name="total_employees"
          type="number"
          value={totalEmployees || ''}
          onChange={onChange}
          placeholder="กรอกจำนวนพนักงาน"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="order_cycle">รอบการสั่งซื้อ (วัน)</Label>
        <Input
          id="order_cycle"
          name="order_cycle"
          type="number"
          value={orderCycle || ''}
          onChange={onChange}
          placeholder="กรอกรอบการสั่งซื้อ"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="previous_model">รุ่นเดิมที่ใช้</Label>
        <Input
          id="previous_model"
          name="previous_model"
          value={previousModel || ''}
          onChange={onChange}
          placeholder="กรอกรุ่นเดิมที่ใช้"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="competitor_details">รายละเอียดคู่แข่ง</Label>
        <Textarea
          id="competitor_details"
          name="competitor_details"
          value={competitorDetails || ''}
          onChange={onChange}
          placeholder="กรอกรายละเอียดคู่แข่ง"
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="old_price">ราคาเดิม</Label>
        <Input
          id="old_price"
          name="old_price"
          type="number"
          value={oldPrice || ''}
          onChange={onChange}
          placeholder="กรอกราคาเดิม"
        />
      </div>

      <div className="space-y-2 lg:col-span-2">
        <Label htmlFor="issues_encountered_list">รายละเอียดปัญหา</Label>
        <Textarea
          id="issues_encountered_list"
          name="issues_encountered_list"
          value={issuesEncounteredList || ''}
          onChange={onChange}
          placeholder="กรอกรายละเอียดปัญหา"
          className="min-h-[100px]"
        />
      </div>
    </div>
  );
} 