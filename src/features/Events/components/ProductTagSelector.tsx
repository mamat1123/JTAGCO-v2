import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/utils";
import { Product } from "@/entities/Product/product";

interface ProductTagSelectorProps {
  products: Product[];
  selectedProductIds: string[];
  onSelectionChange: (productIds: string[]) => void;
  isLoading?: boolean;
}

export function ProductTagSelector({
  products,
  selectedProductIds,
  onSelectionChange,
  isLoading = false,
}: ProductTagSelectorProps) {
  const [open, setOpen] = React.useState(false);

  const selectedProducts = products.filter(product => 
    selectedProductIds.includes(product.id)
  );

  const handleSelect = (productId: string) => {
    const isSelected = selectedProductIds.includes(productId);
    if (isSelected) {
      onSelectionChange(selectedProductIds.filter(id => id !== productId));
    } else {
      onSelectionChange([...selectedProductIds, productId]);
    }
  };

  const handleRemoveTag = (productId: string) => {
    onSelectionChange(selectedProductIds.filter(id => id !== productId));
  };

  return (
    <div className="space-y-2">
      <Label>แท็กสินค้า (Products related to this event)</Label>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={isLoading}
          >
            {isLoading ? (
              "กำลังโหลดสินค้า..."
            ) : selectedProductIds.length === 0 ? (
              "เลือกสินค้าที่เกี่ยวข้อง..."
            ) : (
              `เลือกแล้ว ${selectedProductIds.length} รายการ`
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command>
            <CommandInput placeholder="ค้นหาสินค้า..." />
            <CommandList>
              <CommandEmpty>ไม่พบสินค้า</CommandEmpty>
              <CommandGroup>
                {products.map((product) => (
                  <CommandItem
                    key={product.id}
                    value={product.name}
                    onSelect={() => handleSelect(product.id)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedProductIds.includes(product.id)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {product.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedProducts.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedProducts.map((product) => (
            <Badge
              key={product.id}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {product.name}
              <button
                type="button"
                onClick={() => handleRemoveTag(product.id)}
                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">ลบ {product.name}</span>
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
} 