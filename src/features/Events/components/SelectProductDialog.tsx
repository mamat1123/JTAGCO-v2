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
import { Product, ProductVariant } from '@/entities/Product/product';
import { toast } from 'sonner';
import { SelectProductVariantDialog } from './SelectProductVariantDialog';

interface SelectProductDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (product: Product, variant: ProductVariant, returnDate: Date | null, pickupDate: Date | null) => void;
}

export function SelectProductDialog({
  isOpen,
  onOpenChange,
  onSelect,
}: SelectProductDialogProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showVariantDialog, setShowVariantDialog] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const data = await productAPI.getProducts();
        setProducts(data);
      } catch {
        toast.error('ไม่สามารถดึงข้อมูลสินค้าได้');
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchProducts();
    }
  }, [isOpen]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setShowVariantDialog(true);
  };

  const handleVariantSelect = (variant: ProductVariant, returnDate: Date | null, pickupDate: Date | null) => {
    if (selectedProduct) {
      onSelect(selectedProduct, variant, returnDate, pickupDate);
      setSelectedProduct(null);
      setShowVariantDialog(false);
      onOpenChange(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>เลือกสินค้า</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="ค้นหาสินค้า..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="border rounded-md">
              <div className="h-[400px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ชื่อสินค้า</TableHead>
                      <TableHead>ประเภท</TableHead>
                      <TableHead>รายละเอียด</TableHead>
                      <TableHead className="w-[100px]">เลือก</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">
                          กำลังโหลด...
                        </TableCell>
                      </TableRow>
                    ) : filteredProducts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">
                          ไม่พบสินค้า
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>{product.type}</TableCell>
                          <TableCell>{product.description}</TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleProductSelect(product)}
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
        </DialogContent>
      </Dialog>

      {selectedProduct && (
        <SelectProductVariantDialog
          isOpen={showVariantDialog}
          onOpenChange={setShowVariantDialog}
          onSelect={handleVariantSelect}
          productId={selectedProduct.id}
        />
      )}
    </>
  );
} 