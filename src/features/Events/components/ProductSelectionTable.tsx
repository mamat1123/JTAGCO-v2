import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";
import { Separator } from "@/shared/components/ui/separator";
import { format } from "date-fns";

interface SelectedProduct {
  id: string;
  name: string;
  quantity: number;
  variant?: {
    id: string;
    sku: string;
    attributes: Record<string, any>;
    price: number;
    stock: number;
  };
  return_date: Date | null;
}

interface ProductSelectionTableProps {
  selectedProducts: SelectedProduct[];
  onAddProduct: () => void;
  onRemoveProduct: (productId: string) => void;
  onQuantityChange: (productId: string, quantity: number) => void;
}

export function ProductSelectionTable({
  selectedProducts,
  onAddProduct,
  onRemoveProduct,
  onQuantityChange,
}: ProductSelectionTableProps) {
  return (
    <>
      <Separator />
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Label>สินค้าที่ต้องการเบิก</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAddProduct}
          >
            <Plus className="w-4 h-4 mr-2" />
            เพิ่มสินค้า
          </Button>
        </div>

        {selectedProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ชื่อสินค้า</TableHead>
                  <TableHead>ตัวเลือกสินค้า</TableHead>
                  <TableHead>วันที่คืน</TableHead>
                  <TableHead className="w-[150px]">จำนวน</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedProducts.map((product) => (
                  <TableRow key={`${product.id}-${product.variant?.id}`}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>
                      {product.variant && (
                        <div className="space-y-1">
                          <div className="text-sm font-medium">
                            SKU: {product.variant.sku}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {Object.entries(product.variant.attributes).map(
                              ([key, value]) =>
                                key === "image" ? (
                                  <div
                                    key={key}
                                    className="w-16 h-16 rounded-md overflow-hidden"
                                  >
                                    <img
                                      src={value as string}
                                      alt="Product variant"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ) : (
                                  <Badge key={key} variant="secondary">
                                    {key}: {value}
                                  </Badge>
                                )
                            )}
                          </div>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{product.return_date ? format(product.return_date, "dd/MM/yyyy") : ''}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="1"
                        value={product.quantity}
                        onChange={(e) =>
                          onQuantityChange(product.id, parseInt(e.target.value))
                        }
                        className="w-[100px]"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveProduct(product.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-4">
            ยังไม่มีสินค้าที่เลือก
          </div>
        )}
      </div>
    </>
  );
} 