import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreateCompanyDTO } from "@/entities/Company/company";
import { CompaniesService } from "@/features/Sales/services/CompaniesService";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { toast } from "sonner";

export function CreateCompanyForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateCompanyDTO>({
    name: "",
    email: "",
    phone: "",
    address: "",
    province: "",
    credit: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await CompaniesService.createCompany(formData);
      toast.success("สร้างบริษัทสำเร็จ");
      navigate("/companies");
    } catch (error) {
      console.error("Error creating company:", error);
      toast.error("ไม่สามารถสร้างบริษัทได้");
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

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>สร้างบริษัทใหม่</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">ข้อมูลพื้นฐาน</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">ชื่อบริษัท</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="กรอกชื่อบริษัท"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">อีเมล</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="กรอกอีเมล"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="กรอกเบอร์โทรศัพท์"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="credit">เครดิต</Label>
                  <Input
                    id="credit"
                    name="credit"
                    type="number"
                    value={formData.credit}
                    onChange={handleChange}
                    required
                    placeholder="กรอกเครดิต"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">ข้อมูลที่อยู่</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address">ที่อยู่</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="กรอกที่อยู่"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="province">จังหวัด</Label>
                  <Input
                    id="province"
                    name="province"
                    value={formData.province}
                    onChange={handleChange}
                    placeholder="กรอกจังหวัด"
                  />
                </div>
              </div>
            </div>

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