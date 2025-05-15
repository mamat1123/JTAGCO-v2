import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Textarea } from '@/shared/components/ui/textarea';
import { Product, ProductType, CreateProductDTO } from '@/entities/Product/product';

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: Partial<CreateProductDTO>) => void;
}

export function ProductForm({ initialData, onSubmit }: ProductFormProps) {
  const [formData, setFormData] = useState<Partial<CreateProductDTO>>(
    initialData || {
      name: '',
      type: ProductType.SHOE,
      description: '',
    }
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="type" className="text-sm font-medium">
          Type
        </label>
        <Select
          value={formData.type}
          onValueChange={(value: ProductType) =>
            setFormData((prev) => ({ ...prev, type: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ProductType.SHOE}>Shoe</SelectItem>
            <SelectItem value={ProductType.INSOLE}>Insole</SelectItem>
            <SelectItem value={ProductType.TOE_CAP}>Toe Cap</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
        />
      </div>

      <Button type="submit" className="w-full">
        {initialData ? 'Update' : 'Create'}
      </Button>
    </form>
  );
} 