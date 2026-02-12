import { CreateCompanyForm } from "../components/CreateCompanyForm";
import { CreateCompanyDTO } from "@/entities/Company/company";
import { CompaniesService } from "@/features/Sales/services/CompaniesService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useState } from "react";

export function CreateCompanyPage() {
  const navigate = useNavigate();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdCompany, setCreatedCompany] = useState<{ id: string; name: string } | null>(null);

  const handleSubmit = async (formData: CreateCompanyDTO) => {
    try {
      const dataToSubmit = { ...formData };
      if (dataToSubmit.email === "") {
        delete dataToSubmit.email;
      }
      const company = await CompaniesService.createCompany(dataToSubmit);
      setCreatedCompany(company);
      setShowSuccessModal(true);
      toast.success("สร้างบริษัทสำเร็จ");
    } catch (error) {
      console.error("Error creating company:", error);
      toast.error("ไม่สามารถสร้างบริษัทได้");
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate(`/companies/${createdCompany?.id}`);
  };

  return (
    <>
      <CreateCompanyForm onSubmit={handleSubmit} />
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>สร้างบริษัทสำเร็จ</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>บริษัท {createdCompany?.name} ถูกสร้างเรียบร้อยแล้ว</p>
            <div className="flex justify-end">
              <button
                onClick={handleSuccessModalClose}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                ไปยังหน้าบริษัท
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 