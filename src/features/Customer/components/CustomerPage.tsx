import { useState } from "react";
import { Customer, CreateCustomerDTO } from "@/entities/Customer/customer";
import { customerAPI } from "@/entities/Customer/customerAPI";
import { CustomerList } from "./CustomerList";
import { Button } from "@/shared/components/ui/button";
import { toast } from "sonner";
import { useCompanyStore } from "@/features/Sales/stores/companyStore";

export function CustomerPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { currentCompany, fetchCompany } = useCompanyStore();

  const handleAddCustomer = async (data: CreateCustomerDTO) => {
    if (!currentCompany?.id) return;
    try {
      await customerAPI.createCustomer({
        ...data,
        company_id: currentCompany.id
      });
      toast.success("เพิ่มข้อมูลผู้ติดต่อสำเร็จ");
      fetchCompany(currentCompany?.id);
    } catch {
      toast.error("ไม่สามารถเพิ่มข้อมูลผู้ติดต่อได้");
    }
  };

  const handleEditCustomer = async (customer: Customer) => {
    if (!currentCompany?.id) return;
    const body = {
      company_id: currentCompany.id,
      contact_name: customer.contact_name,
      position: customer.position,
      email: customer.email,
      phone: customer.phone,
      line_id: customer.line_id
    }
    try {
      await customerAPI.updateCustomer(customer.id, body);
      toast.success("แก้ไขข้อมูลผู้ติดต่อสำเร็จ");
      fetchCompany(currentCompany?.id);
    } catch {
      toast.error("ไม่สามารถแก้ไขข้อมูลผู้ติดต่อได้");
    }
  };

  const handleDeleteCustomer = async (customer: Customer) => {
    if (!currentCompany?.id) return;
    try {
      await customerAPI.deleteCustomer(customer.id);
      toast.success("ลบข้อมูลผู้ติดต่อสำเร็จ");
      fetchCompany(currentCompany?.id);
    } catch {
      toast.error("ไม่สามารถลบข้อมูลผู้ติดต่อได้");
    }
  };

  const openAddForm = () => {
    setIsFormOpen(true);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">รายชื่อผู้ติดต่อ</h1>
        <Button onClick={openAddForm}>เพิ่มผู้ติดต่อ</Button>
      </div>

      <CustomerList
        customers={currentCompany?.customers || []}
        onEdit={handleEditCustomer}
        onDelete={handleDeleteCustomer}
        onAdd={handleAddCustomer}
        isAddModalOpen={isFormOpen}
        onAddModalChange={setIsFormOpen}
      />
    </div>
  );
} 