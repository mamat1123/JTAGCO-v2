import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Company } from '@/entities/Company/company';
import { CompaniesService } from '@/features/Sales/services/CompaniesService';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { toast } from 'sonner';
import { BasicInfoForm } from '@/features/Sales/components/BasicInfoForm';
import { AddressForm } from '@/features/Sales/components/AddressForm';
import { BusinessTypeDto } from '@/entities/BusinessType/businessType';
import { BusinessTypeService } from '@/entities/BusinessType/businessTypeAPI';

export function EditCompany() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [businessTypes, setBusinessTypes] = useState<BusinessTypeDto[]>([]);
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
    user_id: null,
    customers: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return;
        const [companyData, businessTypesData] = await Promise.all([
          CompaniesService.fetchCompany(id),
          BusinessTypeService.getAll()
        ]);
        setCompany(companyData);
        setBusinessTypes(businessTypesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('ไม่สามารถโหลดข้อมูลได้');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  const handleBasicInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompany(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBusinessTypeChange = (value: string) => {
    setCompany(prev => ({
      ...prev,
      business_type_id: parseInt(value)
    }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompany(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProvinceChange = (value: string) => {
    setCompany(prev => ({
      ...prev,
      province: value
    }));
  };

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setCompany(prev => ({
      ...prev,
      zipCode: value
    }));
  };

  const handlePositionChange = (lat: number, lng: number) => {
    setCompany(prev => ({
      ...prev,
      position: `${lat},${lng}`
    }));
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">กำลังโหลด...</div>;
  }

  return (
    <div className="container mx-auto p-4">
        <h1 className="text-xl sm:text-2xl font-bold mb-4">แก้ไขข้อมูลบริษัท</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">ข้อมูลพื้นฐาน</CardTitle>
              <CardDescription>ข้อมูลทั่วไปของบริษัท</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <BasicInfoForm
                name={company.name}
                tax_id={company.tax_id || ''}
                business_type_id={company.business_type_id.toString()}
                branch={company.branch || ''}
                email={company.email || ''}
                credit={company.credit}
                businessTypes={businessTypes}
                onChange={handleBasicInfoChange}
                onBusinessTypeChange={handleBusinessTypeChange}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">ข้อมูลที่อยู่</CardTitle>
              <CardDescription>ที่อยู่และพิกัดของบริษัท</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <AddressForm
                address={company.address || ''}
                province={company.province || ''}
                zipCode={company.zipCode || ''}
                latitude={company.position ? parseFloat(company.position.split(',')[0]) : undefined}
                longitude={company.position ? parseFloat(company.position.split(',')[1]) : undefined}
                onAddressChange={handleAddressChange}
                onProvinceChange={handleProvinceChange}
                onZipCodeChange={handleZipCodeChange}
                onPositionChange={handlePositionChange}
              />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">ข้อมูลเพิ่มเติม</CardTitle>
            <CardDescription>รายละเอียดเพิ่มเติมของบริษัท</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label htmlFor="detail">รายละเอียดบริษัท</Label>
                <Input
                  id="detail"
                  name="detail"
                  value={company.detail || ''}
                  onChange={handleBasicInfoChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="business_type_detail">รายละเอียดประเภทธุรกิจ</Label>
                <Input
                  id="business_type_detail"
                  name="business_type_detail"
                  value={company.business_type_detail || ''}
                  onChange={handleBasicInfoChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="competitor_details">รายละเอียดคู่แข่ง</Label>
                <Input
                  id="competitor_details"
                  name="competitor_details"
                  value={company.competitor_details || ''}
                  onChange={handleBasicInfoChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="job_description">รายละเอียดงาน</Label>
                <Input
                  id="job_description"
                  name="job_description"
                  value={company.job_description || ''}
                  onChange={handleBasicInfoChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="issues_encountered_list">รายละเอียดปัญหา</Label>
                <Input
                  id="issues_encountered_list"
                  name="issues_encountered_list"
                  value={company.issues_encountered_list}
                  onChange={handleBasicInfoChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>

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
    </div>
  );
} 