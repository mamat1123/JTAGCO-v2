import { useState, useEffect } from 'react';
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
import { productAPI } from '@/entities/Product/productAPI';
import { Product, CreateProductDTO, ProductVariant, CreateProductVariantDTO } from '@/entities/Product/product';
import { toast, Toaster } from 'sonner';
import { AddProductDialog } from './components/AddProductDialog';
import { EditProductDialog } from './components/EditProductDialog';
import { DeleteProductDialog } from './components/DeleteProductDialog';
import { TableSkeleton } from './components/TableSkeleton';
import { ProductVariants } from './components/ProductVariants';

export default function ProductsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const data = await productAPI.getProducts();
        setProducts(data);
      } catch (err) {
        toast.error('ไม่สามารถดึงข้อมูลสินค้าได้');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Fetch variants when a product is selected
  useEffect(() => {
    const fetchVariants = async () => {
      if (selectedProduct) {
        try {
          const data = await productAPI.getProductVariants(selectedProduct.id);
          setVariants(data);
        } catch (err) {
          toast.error('ไม่สามารถดึงข้อมูลตัวแปรสินค้าได้');
        }
      }
    };

    fetchVariants();
  }, [selectedProduct]);

  // Create product
  const handleCreate = async (data: Partial<CreateProductDTO>) => {
    if (data.name && data.type) {
      try {
        const newProduct = await productAPI.createProduct(data as CreateProductDTO);
        setProducts((prev) => [...prev, newProduct]);
        setIsCreateDialogOpen(false);
        toast.success('เพิ่มสินค้าเรียบร้อยแล้ว');
      } catch (err) {
        toast.error('ไม่สามารถเพิ่มสินค้าได้');
      }
    }
  };

  // Update product
  const handleUpdate = async (data: Partial<CreateProductDTO>) => {
    if (editingProduct) {
      try {
        const updatedProduct = await productAPI.updateProduct(editingProduct.id, data);
        setProducts((prev) =>
          prev.map((product) =>
            product.id === editingProduct.id ? updatedProduct : product
          )
        );
        setEditingProduct(null);
        toast.success('อัปเดตสินค้าเรียบร้อยแล้ว');
      } catch (err) {
        toast.error('ไม่สามารถอัปเดตสินค้าได้');
      }
    }
  };

  // Delete product
  const handleDelete = async () => {
    if (deletingProduct) {
      try {
        await productAPI.deleteProduct(deletingProduct.id);
        setProducts((prev) => prev.filter((product) => product.id !== deletingProduct.id));
        setDeletingProduct(null);
        if (selectedProduct?.id === deletingProduct.id) {
          setSelectedProduct(null);
          setVariants([]);
        }
        toast.success('ลบสินค้าเรียบร้อยแล้ว');
      } catch (err) {
        toast.error('ไม่สามารถลบสินค้าได้');
      }
    }
  };

  // Variant operations
  const handleAddVariant = async (variants: ProductVariant[]) => {
    setVariants((prev) => [...prev, ...variants]);
  };

  const handleUpdateVariant = async (id: string, data: Partial<CreateProductVariantDTO>) => {
    try {
      const updatedVariant = await productAPI.updateProductVariant(id, data);
      setVariants((prev) =>
        prev.map((variant) =>
          variant.id === id ? updatedVariant : variant
        )
      );
      toast.success('อัปเดตตัวแปรสินค้าเรียบร้อยแล้ว');
    } catch (err) {
      toast.error('ไม่สามารถอัปเดตตัวแปรสินค้าได้');
    }
  };

  const handleDeleteVariant = async (id: string) => {
    try {
      await productAPI.deleteProductVariant(id);
      setVariants((prev) => prev.filter((variant) => variant.id !== id));
      toast.success('ลบตัวแปรสินค้าเรียบร้อยแล้ว');
    } catch (err) {
      toast.error('ไม่สามารถลบตัวแปรสินค้าได้');
    }
  };

  if (isLoading) return <TableSkeleton />;

  return (
    <div className="container mx-auto py-6">
      <Toaster position="top-right" richColors />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">สินค้า</h1>
        <AddProductDialog
          isOpen={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onSubmit={handleCreate}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ชื่อสินค้า</TableHead>
                <TableHead>ประเภท</TableHead>
                <TableHead>รายละเอียด</TableHead>
                <TableHead className="w-[100px]">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product: Product) => (
                <TableRow
                  key={product.id}
                  className={selectedProduct?.id === product.id ? 'bg-muted' : ''}
                  onClick={() => setSelectedProduct(product)}
                >
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.type}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingProduct(product);
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingProduct(product);
                        }}
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

        {selectedProduct && (
          <div className="space-y-6">
            <div className="p-4 border rounded-md">
              <h2 className="text-xl font-semibold mb-2">{selectedProduct.name}</h2>
              <p className="text-muted-foreground">{selectedProduct.description}</p>
            </div>
            <ProductVariants
              productId={selectedProduct.id}
              productName={selectedProduct.name}
              variants={variants}
              onAdd={handleAddVariant}
              onUpdate={handleUpdateVariant}
              onDelete={handleDeleteVariant}
            />
          </div>
        )}
      </div>

      <EditProductDialog
        product={editingProduct}
        onOpenChange={() => setEditingProduct(null)}
        onSubmit={handleUpdate}
      />

      <DeleteProductDialog
        isOpen={!!deletingProduct}
        onOpenChange={() => setDeletingProduct(null)}
        onConfirm={handleDelete}
        productName={deletingProduct?.name || ''}
      />
    </div>
  );
}
