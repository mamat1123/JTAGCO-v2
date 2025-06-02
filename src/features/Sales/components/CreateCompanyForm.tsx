import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CreateCompanyDTO } from "@/entities/Company/company";
import { BusinessTypeService } from "@/entities/BusinessType/businessTypeAPI";
import { BusinessTypeDto } from "@/entities/BusinessType/businessType";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { toast } from "sonner";
import { BasicInfoForm } from "./BasicInfoForm";

interface CreateCompanyFormProps {
  onSubmit: (formData: CreateCompanyDTO) => Promise<void>;
}

export function CreateCompanyForm({ onSubmit }: CreateCompanyFormProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [businessTypes, setBusinessTypes] = useState<BusinessTypeDto[]>([]);
  const [formData, setFormData] = useState<CreateCompanyDTO>({
    name: "",
    email: "",
    credit: 0,
    tax_id: "",
    branch: "",
    business_type_id: undefined,
  });

  useEffect(() => {
    const fetchBusinessTypes = async () => {
      try {
        const types = await BusinessTypeService.getAll();
        setBusinessTypes(types);
      } catch (error) {
        console.error("Error fetching business types:", error);
        toast.error("ไม่สามารถโหลดประเภทธุรกิจได้");
      }
    };

    fetchBusinessTypes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Convert credit to number and validate
      const credit = Number(formData.credit);
      if (isNaN(credit)) {
        toast.error("กรุณากรอกเครดิตเป็นตัวเลข");
        return;
      }

      // Ensure business_type_id is a string
      const submitData = {
        ...formData,
        credit,
        business_type_id: formData.business_type_id || 0
      };

      await onSubmit(submitData);
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการสร้างบริษัท");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBusinessTypeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      business_type_id: value ? parseInt(value) : undefined
    }));
  };

  const handleBusinessTypeDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      business_type_detail: e.target.value
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>สร้างบริษัทใหม่</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <BasicInfoForm
              name={formData.name}
              tax_id={formData.tax_id}
              business_type_id={formData.business_type_id}
              branch={formData.branch}
              email={formData.email}
              credit={formData.credit}
              businessTypes={businessTypes}
              onChange={handleChange}
              onBusinessTypeChange={handleBusinessTypeChange}
              onBusinessTypeDetailChange={handleBusinessTypeDetailChange}
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/companies")}
                disabled={loading}
              >
                ยกเลิก
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "กำลังสร้าง..." : "สร้างบริษัท"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 