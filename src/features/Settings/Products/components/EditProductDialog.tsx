import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Button } from '@/shared/components/ui/button';
import { CreateProductDTO, Product, ProductType } from '@/entities/Product/product';

interface EditProductDialogProps {
  product: Product | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<CreateProductDTO>) => void;
}

export function EditProductDialog({ product, onOpenChange, onSubmit }: EditProductDialogProps) {
  const [formData, setFormData] = useState<Partial<CreateProductDTO>>({
    name: '',
    type: undefined,
    description: '',
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        type: product.type,
        description: product.description,
      });
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!product) return null;

  return (
    <Dialog open={!!product} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>แก้ไขสินค้า</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">ชื่อสินค้า</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">ประเภทสินค้า</Label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, type: value as ProductType }))
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="เลือกประเภทสินค้า" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="shoe">รองเท้า</SelectItem>
                <SelectItem value="insole">พื้นรองเท้า</SelectItem>
                <SelectItem value="toe_cap">หัวรองเท้า</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">รายละเอียด</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <Button type="submit" className="w-full">
            บันทึกการเปลี่ยนแปลง
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
} 