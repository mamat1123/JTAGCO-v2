import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UpdateCompanyDTO } from '@/entities/Company/company';
import { CompaniesService } from '@/features/Sales/services/CompaniesService';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { toast } from 'sonner';
import { BasicInfoForm } from '@/features/Sales/components/BasicInfoForm';
import { AddressForm } from '@/features/Sales/components/AddressForm';
import { BusinessDetailsForm } from '@/features/Sales/components/BusinessDetailsForm';
import { BusinessTypeDto } from '@/entities/BusinessType/businessType';
import { BusinessTypeService } from '@/entities/BusinessType/businessTypeAPI';

export function EditCompany() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [businessTypes, setBusinessTypes] = useState<BusinessTypeDto[]>([]);
  const [company, setCompany] = useState<UpdateCompanyDTO>({
    name: '',
    business_type_id: undefined,
    tax_id: null,
    branch: null,
    address: null,
    province: null,
    zip_code: 0,
    email: null,
    position: null,
    previous_model: null,
    old_price: 0,
    job_description: null,
    total_employees: 0,
    credit: 0,
    order_cycle: 0,
    business_type_detail: null,
    competitor_details: null,
    sub_district: null,
    district: null,
    detail: null,
    issues_encountered_list: undefined
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return;
        const [companyData, businessTypesData] = await Promise.all([
          CompaniesService.fetchCompany(id),
          BusinessTypeService.getAll()
        ]);
        // Remove properties that should not exist in UpdateCompanyDTO
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id: _id, created_at: _created_at, updated_at: _updated_at, customers: _customers, user_id: _user_id, ...updateData } = companyData;
        setCompany({
          ...updateData,
          zip_code: updateData.zip_code ? Number(updateData.zip_code) : 0
        });
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
      await CompaniesService.updateCompany(id, {
        ...company,
        zip_code: company.zip_code ? Number(company.zip_code) : 0,
        credit: Number(company.credit),
        order_cycle: Number(company.order_cycle),
        total_employees: Number(company.total_employees),
        old_price: Number(company.old_price),
      });
      toast.success('อัพเดทข้อมูลบริษัทสำเร็จ');
      navigate(`/companies/${id}`);
    } catch (error) {
      console.error('Error updating company:', error);
      toast.error('ไม่สามารถอัพเดทข้อมูลบริษัทได้');
    }
  };

  const handleBasicInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleBusinessTypeDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompany(prev => ({
      ...prev,
      business_type_detail: e.target.value
    }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      zip_code: Number(value) || 0
    }));
  };

  const handlePositionChange = (lat: number, lng: number) => {
    setCompany(prev => ({
      ...prev,
      position: {
        lat: lat.toString(),
        lng: lng.toString()
      }
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
                business_type_detail={company.business_type_detail || ''}
                name={company.name || ''}
                tax_id={company.tax_id || ''}
                business_type_id={company.business_type_id}
                branch={company.branch || ''}
                email={company.email || ''}
                credit={company.credit}
                order_cycle={company.order_cycle}
                businessTypes={businessTypes}
                onChange={handleBasicInfoChange}
                onBusinessTypeChange={handleBusinessTypeChange}
                onBusinessTypeDetailChange={handleBusinessTypeDetailChange}
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
                zipCode={company.zip_code?.toString() || ''}
                latitude={company.position ? parseFloat(company.position.lat || '0') : undefined}
                longitude={company.position ? parseFloat(company.position.lng || '0') : undefined}
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
            <CardTitle className="text-lg sm:text-xl">รายละเอียดธุรกิจ</CardTitle>
            <CardDescription>ข้อมูลเพิ่มเติมเกี่ยวกับธุรกิจ</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <BusinessDetailsForm
              detail={company.detail ?? null}
              jobDescription={company.job_description ?? null}
              totalEmployees={company.total_employees ?? 0}
              orderCycle={company.order_cycle ?? 0}
              previousModel={company.previous_model ?? null}
              competitorDetails={company.competitor_details ?? null}
              oldPrice={company.old_price ?? 0}
              issuesEncounteredList={company.issues_encountered_list ?? null}
              onChange={handleBasicInfoChange}
            />
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