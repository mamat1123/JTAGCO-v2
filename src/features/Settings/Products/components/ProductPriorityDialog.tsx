import { useState, useEffect } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Product, CreateProductDTO } from '@/entities/Product/product';
import { productAPI } from '@/entities/Product/productAPI';
import { toast } from 'sonner';
import { arrayMove } from '@dnd-kit/sortable';

interface ProductPriorityDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  products: Product[];
}

function SortableItem({ product, isUpdating }: { product: Product; isUpdating: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: product.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 bg-white border rounded-md hover:shadow-sm"
    >
      <button
        className="cursor-grab text-muted-foreground hover:text-foreground"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-4 h-4" />
      </button>
      <span className="flex-1">{product.name}</span>
      {isUpdating && (
        <span className="text-sm text-muted-foreground">updating...</span>
      )}
    </div>
  );
}

export function ProductPriorityDialog({ isOpen, onOpenChange, products }: ProductPriorityDialogProps) {
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const [updatingProductId, setUpdatingProductId] = useState<string | null>(null);

  useEffect(() => {
    const sorted = [...products].sort((a, b) => (a.priority || 0) - (b.priority || 0));
    setLocalProducts(sorted);
  }, [products]);

  const onDragEnd = async (event: { active: { id: string | number }; over: { id: string | number } | null }) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = localProducts.findIndex(p => p.id === String(active.id));
    const newIndex = localProducts.findIndex(p => p.id === String(over.id));

    if (oldIndex === -1 || newIndex === -1) return;

    const newOrder = arrayMove(localProducts, oldIndex, newIndex);
    const movedProduct = newOrder[newIndex];

    setLocalProducts(newOrder);
    setUpdatingProductId(movedProduct.id);

    try {
      await productAPI.updateProduct(movedProduct.id, { priority: newIndex } as Partial<CreateProductDTO>);
      setUpdatingProductId(null);
      toast.success('อัปเดตความสำคัญเรียบร้อยแล้ว');
    } catch {
      setUpdatingProductId(null);
      toast.error('ไม่สามารถอัปเดตความสำคัญได้');
      const reverted = arrayMove(newOrder, newIndex, oldIndex);
      setLocalProducts(reverted);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>จัดลำดับความสำคัญของสินค้า</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={localProducts.map(p => p.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2 py-4">
                {localProducts.map((product) => (
                  <SortableItem
                    key={product.id}
                    product={product}
                    isUpdating={updatingProductId === product.id}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </DialogContent>
    </Dialog>
  );
}
