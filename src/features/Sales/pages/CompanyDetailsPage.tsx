import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCompanyStore } from "@/features/Sales/stores/companyStore";
import { CustomerList } from "@/features/Customer/components/CustomerList";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CustomerPage } from "@/features/Customer/components/CustomerPage";
import { BusinessTypeDto } from "@/entities/BusinessType/businessType";
import { BusinessTypeService } from "@/entities/BusinessType/businessTypeAPI";
import { CompanyEvents } from "@/features/Sales/components/CompanyEvents";

export function CompanyDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentCompany, fetchCompany } = useCompanyStore();
  const [businessTypes, setBusinessTypes] = useState<BusinessTypeDto[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        await fetchCompany(id);
        try {
          const types = await BusinessTypeService.getAll();
          setBusinessTypes(types);
        } catch (error) {
          console.error('Error fetching business types:', error);
        }
      }
    };
    fetchData();
  }, [id, fetchCompany]);

  if (!currentCompany) {
    return <div className="text-center py-4">Company not found</div>;
  }

  const getBusinessTypeName = (id: number) => {
    console.log(id, businessTypes);
    const businessType = businessTypes.find(type => type.id === id);
    return businessType?.name || '-';
  };

  return (
    <div className="container mx-auto px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-bold">รายละเอียดบริษัท</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={() => navigate(`/companies/${id}/edit`)}
            className="w-full sm:w-auto"
          >
            แก้ไขข้อมูล
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/companies')}
            className="w-full sm:w-auto"
          >
            กลับไปยังรายการบริษัท
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
        {/* ข้อมูลพื้นฐาน */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">ข้อมูลพื้นฐาน</CardTitle>
            <CardDescription>ข้อมูลทั่วไปของบริษัท</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <p className="text-xs sm:text-sm text-gray-500">ชื่อบริษัท</p>
                <p className="text-sm sm:text-base font-medium">{currentCompany.name}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">เลขประจำตัวผู้เสียภาษี</p>
                <p className="text-sm sm:text-base font-medium">{currentCompany.tax_id || '-'}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">สาขา</p>
                <p className="text-sm sm:text-base font-medium">{currentCompany.branch || '-'}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">ประเภทธุรกิจ</p>
                <p className="text-sm sm:text-base font-medium">{getBusinessTypeName(currentCompany.business_type_id)}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">รายละเอียดประเภทธุรกิจ</p>
                <p className="text-sm sm:text-base font-medium">{currentCompany.business_type_detail || '-'}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">อีเมล</p>
                <p className="text-sm sm:text-base font-medium">{currentCompany.email || '-'}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">เครดิต</p>
                <p className="text-sm sm:text-base font-medium">{currentCompany.credit || '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ที่อยู่บริษัท */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">ที่อยู่บริษัท</CardTitle>
            <CardDescription>ข้อมูลที่อยู่และพิกัด</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="sm:col-span-2">
                <p className="text-xs sm:text-sm text-gray-500">ที่อยู่</p>
                <p className="text-sm sm:text-base font-medium">{currentCompany.address || '-'}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">จังหวัด</p>
                <p className="text-sm sm:text-base font-medium">{currentCompany.province || '-'}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">อำเภอ</p>
                <p className="text-sm sm:text-base font-medium">{currentCompany.district || '-'}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">ตำบล</p>
                <p className="text-sm sm:text-base font-medium">{currentCompany.sub_district || '-'}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">รหัสไปรษณีย์</p>
                <p className="text-sm sm:text-base font-medium">{currentCompany.zip_code || '-'}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">ละติจูด</p>
                <p className="text-sm sm:text-base font-medium">{currentCompany.position?.lat || '-'}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">ลองจิจูด</p>
                <p className="text-sm sm:text-base font-medium">{currentCompany.position?.lng || '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* รายละเอียดธุรกิจ */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">รายละเอียดธุรกิจ</CardTitle>
            <CardDescription>ข้อมูลเพิ่มเติมเกี่ยวกับธุรกิจ</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="sm:col-span-2">
                <p className="text-xs sm:text-sm text-gray-500">ข้อมูลบริษัท</p>
                <p className="text-sm sm:text-base font-medium">{currentCompany.detail || '-'}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs sm:text-sm text-gray-500">รายละเอียดงาน</p>
                <p className="text-sm sm:text-base font-medium">{currentCompany.job_description || '-'}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">จำนวนพนักงาน</p>
                <p className="text-sm sm:text-base font-medium">{currentCompany.total_employees || '-'}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">รอบการสั่งซื้อ</p>
                <p className="text-sm sm:text-base font-medium">{currentCompany.order_cycle || '-'}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">รุ่นที่ใช้ก่อนหน้า</p>
                <p className="text-sm sm:text-base font-medium">{currentCompany.previous_model || '-'}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">ราคาเดิม</p>
                <p className="text-sm sm:text-base font-medium">{currentCompany.old_price || '-'}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs sm:text-sm text-gray-500">รายละเอียดคู่แข่ง</p>
                <p className="text-sm sm:text-base font-medium">{currentCompany.competitor_details || '-'}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs sm:text-sm text-gray-500">รายละเอียดปัญหา</p>
                <p className="text-sm sm:text-base font-medium">{currentCompany.issues_encountered_list || '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ประวัติการติดต่อ */}
        <div className="lg:col-span-2">
          <CompanyEvents companyId={currentCompany.id} />
        </div>
      </div>

      <CustomerPage />
    </div>
  );
} 