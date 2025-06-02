import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { ProductVariant, CreateProductVariantDTO } from '@/entities/Product/product';
import { ProductVariantFormDialog } from './ProductVariantFormDialog';
import { toast, Toaster } from 'sonner';
import { productAPI } from '@/entities/Product/productAPI';
import { ProductVariantFormSingleDialog } from "./ProductVariantFormSingleDialog";

interface ProductVariantsProps {
  productId: string;
  variants: ProductVariant[];
  onAdd: (data: ProductVariant[]) => void;
  onUpdate: (id: string, data: Partial<CreateProductVariantDTO>) => void;
  onDelete: (id: string) => void;
  productName: string;
}

export function ProductVariants({ productId, variants, onAdd, onUpdate, onDelete, productName }: ProductVariantsProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleSubmit = async (formData: any) => {
    try {
      setIsLoading(true);
      const variantData: CreateProductVariantDTO = {
        product_id: productId,
        attributes: { ...formData.attributes },
        price: Number(formData.price) || 0,
        stock: Number(formData.stock) || 0,
        is_made_to_order: Boolean(formData.is_made_to_order),
      };

      if (editingVariant) {
        onUpdate(editingVariant.id, variantData);
        setEditingVariant(null);
        toast.success("อัพเดทสำเร็จ", {
          description: "อัพเดทตัวแปรสินค้าเรียบร้อยแล้ว",
        });
      } else {
        const createdVariants = await productAPI.createMultipleProductVariants(formData);
        onAdd(createdVariants);
        setIsAddDialogOpen(false);
        toast.success("เพิ่มสำเร็จ", {
          description: `เพิ่มตัวแปรสินค้า ${createdVariants.length} รายการเรียบร้อยแล้ว`,
        });
      }
    } catch (error) {
      toast.error("เกิดข้อผิดพลาด", {
        description: "ไม่สามารถเพิ่มตัวแปรสินค้าได้",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = async (data: CreateProductVariantDTO) => {
    if (!selectedVariant) return;
    
    try {

      console.log(data);      
      setIsEditDialogOpen(false);
      setSelectedVariant(undefined);
    } catch (error) {
      console.error("Failed to update variant:", error);
    }
  };

  const handleDelete = (id: string) => {
    onDelete(id);
    toast.success("ลบสำเร็จ", {
      description: "ลบตัวแปรสินค้าเรียบร้อยแล้ว",
    });
  };

  return (
    <div className="space-y-4">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">ตัวแปรสินค้า</h2>
        <ProductVariantFormDialog
          isOpen={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onSubmit={handleSubmit}
          productId={productId}
          productName={productName}
          isLoading={isLoading}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">รูปภาพ</TableHead>
              <TableHead>ขนาด</TableHead>
              <TableHead>สี</TableHead>
              <TableHead>พื้นรองเท้า</TableHead>
              <TableHead>หัวรองเท้า</TableHead>
              <TableHead>ราคา</TableHead>
              {/* <TableHead>จำนวนคงเหลือ</TableHead> */}
              <TableHead className="w-[100px]">จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {variants.map((variant) => (
              <TableRow key={variant.id}>
                <TableCell>
                  {variant.attributes.image ? (
                    <div className="w-16 h-16 rounded-md overflow-hidden">
                      <img
                        src={variant.attributes.image}
                        alt={`Product variant ${variant.id}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-md bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-400 text-xs">ไม่มีรูป</span>
                    </div>
                  )}
                </TableCell>
                <TableCell>{variant.attributes.size}</TableCell>
                <TableCell>
                  {variant.attributes.color}
                </TableCell>
                <TableCell>{variant.attributes.has_insole ? 'มี' : 'ไม่มี'}</TableCell>
                <TableCell>{variant.attributes.has_toe_cap ? 'มี' : 'ไม่มี'}</TableCell>
                <TableCell>{variant.price.toFixed(2)}</TableCell>
                {/* <TableCell>{variant.stock}</TableCell> */}
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(variant)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(variant.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ProductVariantFormSingleDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        variant={selectedVariant}
        onSubmit={handleEditSubmit}
      />
    </div>
  );
} 