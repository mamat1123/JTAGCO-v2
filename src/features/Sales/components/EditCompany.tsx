import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Company } from '@/entities/Company/company';
import { CompaniesService } from '@/features/Sales/services/CompaniesService';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { toast } from 'sonner';

export function EditCompany() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState<Company>({
    id: '',
    created_at: '',
    name: '',
    business_type_id: 0,
    tax_id: null,
    branch: null,
    address: null,
    province: null,
    zipCode: null,
    email: null,
    position: null,
    previous_model: null,
    issues_encountered_list: '',
    old_price: 0,
    job_description: null,
    total_employees: null,
    credit: 0,
    order_cycle: 0,
    business_type_detail: null,
    competitor_details: null,
    sub_district: null,
    updated_at: '',
    district: null,
    detail: null,
    zip_code: null,
    user_id: null
  });

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        if (!id) return;
        const response = await CompaniesService.fetchCompany(id);
        setCompany(response);
      } catch (error) {
        console.error('Error fetching company:', error);
        toast.error('ไม่สามารถโหลดข้อมูลบริษัทได้');
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!id) return;
      await CompaniesService.updateCompany(id, company);
      toast.success('อัพเดทข้อมูลบริษัทสำเร็จ');
      navigate('/companies');
    } catch (error) {
      console.error('Error updating company:', error);
      toast.error('ไม่สามารถอัพเดทข้อมูลบริษัทได้');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompany(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">กำลังโหลด...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>แก้ไขข้อมูลบริษัท</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">ข้อมูลพื้นฐาน</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="id">รหัสลูกค้า</Label>
                  <Input
                    id="id"
                    name="id"
                    value={company.id}
                    onChange={handleChange}
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">ชื่อบริษัท</Label>
                  <Input
                    id="name"
                    name="name"
                    value={company.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business_type_id">ประเภทธุรกิจ</Label>
                  <Input
                    id="business_type_id"
                    name="business_type_id"
                    type="number"
                    value={company.business_type_id}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tax_id">เลขประจำตัวผู้เสียภาษี</Label>
                  <Input
                    id="tax_id"
                    name="tax_id"
                    value={company.tax_id || ''}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="branch">สาขา</Label>
                  <Input
                    id="branch"
                    name="branch"
                    value={company.branch || ''}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">ตำแหน่ง</Label>
                  <Input
                    id="position"
                    name="position"
                    value={company.position || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">ข้อมูลที่อยู่</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address">ที่อยู่</Label>
                  <Input
                    id="address"
                    name="address"
                    value={company.address || ''}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="province">จังหวัด</Label>
                  <Input
                    id="province"
                    name="province"
                    value={company.province || ''}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="district">อำเภอ</Label>
                  <Input
                    id="district"
                    name="district"
                    value={company.district || ''}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sub_district">ตำบล</Label>
                  <Input
                    id="sub_district"
                    name="sub_district"
                    value={company.sub_district || ''}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zip_code">รหัสไปรษณีย์</Label>
                  <Input
                    id="zip_code"
                    name="zip_code"
                    value={company.zip_code || ''}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">อีเมล</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={company.email || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">ข้อมูลธุรกิจ</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="previous_model">รุ่นที่ใช้ก่อนหน้า</Label>
                  <Input
                    id="previous_model"
                    name="previous_model"
                    value={company.previous_model || ''}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="old_price">ราคาเดิม</Label>
                  <Input
                    id="old_price"
                    name="old_price"
                    type="number"
                    value={company.old_price}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="total_employees">จำนวนพนักงาน</Label>
                  <Input
                    id="total_employees"
                    name="total_employees"
                    type="number"
                    value={company.total_employees || ''}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="credit">เครดิต</Label>
                  <Input
                    id="credit"
                    name="credit"
                    type="number"
                    value={company.credit}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order_cycle">รอบการสั่งซื้อ</Label>
                  <Input
                    id="order_cycle"
                    name="order_cycle"
                    type="number"
                    value={company.order_cycle}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">ข้อมูลเพิ่มเติม</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="detail">รายละเอียดบริษัท</Label>
                  <Input
                    id="detail"
                    name="detail"
                    value={company.detail || ''}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business_type_detail">รายละเอียดประเภทธุรกิจ</Label>
                  <Input
                    id="business_type_detail"
                    name="business_type_detail"
                    value={company.business_type_detail || ''}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="competitor_details">รายละเอียดคู่แข่ง</Label>
                  <Input
                    id="competitor_details"
                    name="competitor_details"
                    value={company.competitor_details || ''}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="job_description">รายละเอียดงาน</Label>
                  <Input
                    id="job_description"
                    name="job_description"
                    value={company.job_description || ''}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="issues_encountered_list">รายละเอียดปัญหา</Label>
                  <Input
                    id="issues_encountered_list"
                    name="issues_encountered_list"
                    value={company.issues_encountered_list}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="detail">รายละเอียดเพิ่มเติม</Label>
                  <Input
                    id="detail"
                    name="detail"
                    value={company.detail || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/sales')}
              >
                ยกเลิก
              </Button>
              <Button type="submit">
                บันทึก
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 