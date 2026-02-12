import { Customer, CreateCustomerDTO } from "@/entities/Customer/customer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { CustomerForm } from "./CustomerForm";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { toast } from "sonner";

interface CustomerListProps {
  customers: Customer[];
  onEdit?: (customer: Customer) => Promise<void>;
  onDelete?: (customer: Customer) => Promise<void>;
  onAdd?: (data: CreateCustomerDTO) => Promise<void>;
  isAddModalOpen?: boolean;
  onAddModalChange?: (open: boolean) => void;
  showBackButton?: boolean;
}

export function CustomerList({ 
  customers, 
  onEdit, 
  onDelete, 
  onAdd,
  isAddModalOpen = false,
  onAddModalChange,
  showBackButton = false 
}: CustomerListProps) {
  const navigate = useNavigate();
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEdit = (customer: Customer) => {
    setCustomerToEdit(customer);
  };

  const handleDelete = (customer: Customer) => {
    setCustomerToDelete(customer);
  };

  const confirmDelete = async () => {
    if (customerToDelete && onDelete) {
      try {
        setIsSubmitting(true);
        await onDelete(customerToDelete);
        toast.success("ลบข้อมูลผู้ติดต่อสำเร็จ");
      } catch {
        toast.error("ไม่สามารถลบข้อมูลผู้ติดต่อได้");
      } finally {
        setIsSubmitting(false);
        setCustomerToDelete(null);
      }
    }
  };

  const handleEditSubmit = async (data: Partial<Customer>) => {
    if (customerToEdit && onEdit) {
      try {
        setIsSubmitting(true);
        await onEdit({
          ...customerToEdit,
          ...data,
        });
        toast.success("แก้ไขข้อมูลผู้ติดต่อสำเร็จ");
        setCustomerToEdit(null);
      } catch {
        toast.error("ไม่สามารถแก้ไขข้อมูลผู้ติดต่อได้");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleAddSubmit = async (data: Partial<Customer>) => {
    if (onAdd) {
      try {
        setIsSubmitting(true);
        await onAdd(data as CreateCustomerDTO);
        toast.success("เพิ่มข้อมูลผู้ติดต่อสำเร็จ");
        onAddModalChange?.(false);
      } catch {
        toast.error("ไม่สามารถเพิ่มข้อมูลผู้ติดต่อได้");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      {showBackButton && (
        <div className="flex justify-end">
          <Button variant="outline" onClick={() => navigate(-1)}>
            กลับ
          </Button>
        </div>
      )}
      
      {customers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customers.map((customer) => (
            <Card key={customer.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  {customer.image_url && (
                    <img
                      src={customer.image_url}
                      alt={`${customer.contact_name}'s profile`}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <CardTitle className="text-lg">{customer.contact_name}</CardTitle>
                    <CardDescription>{customer.position}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">เบอร์โทรศัพท์:</span>
                    <span className="text-sm">{customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Line ID:</span>
                    <span className="text-sm">{customer?.line_id || '-'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">อีเมล:</span>
                    <span className="text-sm">{customer.email || '-'}</span>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    size="sm"
                    onClick={() => handleEdit(customer)}
                    disabled={isSubmitting}
                  >
                    แก้ไข
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(customer)}
                    disabled={isSubmitting}
                  >
                    ลบ
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          ไม่มีข้อมูลผู้ติดต่อ
        </div>
      )}

      <DeleteConfirmationDialog
        customer={customerToDelete}
        open={!!customerToDelete}
        onOpenChange={(open) => !open && setCustomerToDelete(null)}
        onConfirm={confirmDelete}
      />

      <CustomerForm
        isOpen={!!customerToEdit}
        onClose={() => setCustomerToEdit(null)}
        onSubmit={handleEditSubmit}
        initialData={customerToEdit ? {
          contact_name: customerToEdit.contact_name,
          position: customerToEdit.position,
          phone: customerToEdit.phone,
          email: customerToEdit.email,
          line_id: customerToEdit.line_id,
        } : undefined}
        mode="edit"
      />

      <CustomerForm
        isOpen={isAddModalOpen}
        onClose={() => onAddModalChange?.(false)}
        onSubmit={handleAddSubmit}
        mode="add"
      />
    </div>
  );
} 