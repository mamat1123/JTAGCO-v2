import { useState, useEffect } from 'react';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { Input } from '@/shared/components/ui/input';
import { productAPI } from '@/entities/Product/productAPI';
import { ProductVariant } from '@/entities/Product/product';
import { toast } from 'sonner';
import { Badge } from '@/shared/components/ui/badge';

interface SelectProductVariantDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (variant: ProductVariant) => void;
  productId: string;
}

export function SelectProductVariantDialog({
  isOpen,
  onOpenChange,
  onSelect,
  productId,
}: SelectProductVariantDialogProps) {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchVariants = async () => {
      try {
        setIsLoading(true);
        const data = await productAPI.getProductVariants(productId);
        setVariants(data);
      } catch (err) {
        toast.error('ไม่สามารถดึงข้อมูลตัวเลือกสินค้าได้');
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && productId) {
      fetchVariants();
    }
  }, [isOpen, productId]);

  const filteredVariants = variants.filter((variant) =>
    variant.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatAttributes = (attributes: Record<string, any>) => {
    return Object.entries(attributes).map(([key, value]) => {
      if (key.toLowerCase() === 'image') {
        return (
          <div key={key} className="flex items-center gap-2 mb-2">
            <div className="relative w-16 h-16 flex-shrink-0">
              <img
                src={value}
                alt="Product variant"
                className="w-full h-full object-cover rounded-md"
              />
            </div>
          </div>
        );
      }
      return (
        <Badge key={key} variant="secondary" className="mr-1 mb-1">
          {key}: {value}
        </Badge>
      );
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-4xl h-[90vh] sm:h-[80vh] flex flex-col overflow-hidden">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>เลือกตัวเลือกสินค้า</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 flex-1 flex flex-col overflow-hidden">
          <div className="flex-shrink-0">
            <Input
              placeholder="ค้นหาตัวเลือกสินค้า..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="border rounded-md flex-1 overflow-auto">
            <div className="min-w-full inline-block align-middle">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-background z-10">
                    <TableRow>
                      <TableHead className="whitespace-nowrap">SKU</TableHead>
                      <TableHead className="min-w-[300px]">รายละเอียด</TableHead>
                      <TableHead className="whitespace-nowrap">ราคา</TableHead>
                      <TableHead className="whitespace-nowrap">จำนวนคงเหลือ</TableHead>
                      <TableHead className="w-[100px] whitespace-nowrap">เลือก</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center">
                          กำลังโหลด...
                        </TableCell>
                      </TableRow>
                    ) : filteredVariants.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center">
                          ไม่พบตัวเลือกสินค้า
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredVariants.map((variant) => (
                        <TableRow key={variant.id}>
                          <TableCell className="whitespace-nowrap">{variant.sku}</TableCell>
                          <TableCell>
                            <div className="max-h-[200px] overflow-y-auto pr-2">
                              <div className="flex flex-wrap gap-1">
                                {formatAttributes(variant.attributes)}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">{variant.price.toLocaleString()} บาท</TableCell>
                          <TableCell className="whitespace-nowrap">{variant.stock}</TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                onSelect(variant);
                                onOpenChange(false);
                              }}
                              className="w-full"
                            >
                              เลือก
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 