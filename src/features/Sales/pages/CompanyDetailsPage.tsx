import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCompanyStore } from "@/features/Sales/stores/companyStore";
import { useProfile } from "@/features/Profile/hooks/useProfile";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { CustomerPage } from "@/features/Customer/components/CustomerPage";
import { BusinessTypeDto } from "@/entities/BusinessType/businessType";
import { BusinessTypeService } from "@/entities/BusinessType/businessTypeAPI";
import { CompanyEvents } from "@/features/Sales/components/CompanyEvents";
import { CompaniesService } from "@/features/Sales/services/CompaniesService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { toast } from "sonner";
import { PlusCircle } from "lucide-react";
import { UserRole } from "@/shared/types/roles";
import { CompanyTransferModal } from "@/features/Sales/components/CompanyTransferModal";
import { CompanyDto } from "@/entities/Company/company";
import { Profiles } from "@/entities/Profile/profile";
import { profileService } from "@/features/Profile/services/profileService";

export function CompanyDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentCompany, fetchCompany } = useCompanyStore();
  const { profile } = useProfile();
  const [businessTypes, setBusinessTypes] = useState<BusinessTypeDto[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [profiles, setProfiles] = useState<Profiles>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        await fetchCompany(id);
        try {
          const [types, profilesList] = await Promise.all([
            BusinessTypeService.getAll(),
            profileService.getProfile()
          ]);
          setBusinessTypes(types);
          setProfiles(profilesList);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };
    fetchData();
  }, [id, fetchCompany]);

  const handleDelete = async () => {
    if (!id) return;

    try {
      await CompaniesService.deleteCompany(id);
      toast.success("ลบบริษัทสำเร็จ");
      navigate('/companies');
    } catch (error) {
      console.error('Error deleting company:', error);
      toast.error("เกิดข้อผิดพลาดในการลบบริษัท");
    }
  };

  if (!currentCompany) {
    return <div className="text-center py-4">Company not found</div>;
  }

  // Check if user has access to view this company
  const isSuperAdmin = profile?.role === UserRole.SUPER_ADMIN || profile?.role === UserRole.MANAGER;
  const isSalesUser = profile?.role === UserRole.SALES;
  const hasAccess = isSuperAdmin || (isSalesUser && currentCompany.user_id === profile?.id);

  // if (!hasAccess) {
  //   return (
  //     <div className="text-center py-4">
  //       <p>คุณไม่มีสิทธิ์เข้าถึงข้อมูลบริษัทนี้</p>
  //       <Button
  //         variant="outline"
  //         onClick={() => navigate('/companies')}
  //         className="mt-4"
  //       >
  //         กลับไปยังรายการบริษัท
  //       </Button>
  //     </div>
  //   );
  // }

  const getBusinessTypeName = (id: number) => {
    const businessType = businessTypes.find(type => type.id === id);
    return businessType?.name || '-';
  };

  return (
    <div className="container mx-auto px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
      <Button
        variant="outline"
        onClick={() => navigate('/companies')}
        className="w-full sm:w-auto"
      >
        กลับไปยังรายการบริษัท
      </Button>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-bold">รายละเอียดบริษัท</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          {
            hasAccess && (
              <>
                <Button
                  onClick={() => navigate(`/companies/${id}/events/create`)}
                  className="w-full sm:w-auto"
                  variant="default"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  สร้างกิจกรรม
                </Button>
                <Button
                  onClick={() => navigate(`/companies/${id}/edit`)}
                  className="w-full sm:w-auto"
                >
                  แก้ไขข้อมูล
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setIsTransferDialogOpen(true)}
                  className="w-full sm:w-auto"
                >
                  โอน
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="w-full sm:w-auto"
                >
                  ลบ
                </Button>
              </>
            )
          }

        </div>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ยืนยันการลบ</DialogTitle>
            <DialogDescription>
              คุณต้องการลบบริษัท {currentCompany.name} ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              ยกเลิก
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              ลบ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
      <CompanyTransferModal
        open={isTransferDialogOpen}
        onClose={() => setIsTransferDialogOpen(false)}
        onOpenChange={setIsTransferDialogOpen}
        company={currentCompany as CompanyDto}
        profiles={profiles}
        onSuccess={() => fetchCompany(id!)}
      />
    </div>
  );
} 