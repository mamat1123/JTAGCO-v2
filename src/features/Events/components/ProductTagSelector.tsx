import * as React from "react";
import { ChevronsUpDown, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
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
import { Product } from "@/entities/Product/product";

interface TaggedProduct {
  product_id: string;
  name: string;
  price: number;
}

interface ProductTagSelectorProps {
  products: Product[];
  taggedProducts: TaggedProduct[];
  onTaggedProductsChange: (taggedProducts: TaggedProduct[]) => void;
  isLoading?: boolean;
}

export function ProductTagSelector({
  products,
  taggedProducts,
  onTaggedProductsChange,
  isLoading = false,
}: ProductTagSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedProductId, setSelectedProductId] = React.useState<string>("");
  const [newProductPrice, setNewProductPrice] = React.useState<string>("");

  const selectedProductIds = taggedProducts.map(tp => tp.product_id);
  const availableProducts = products.filter(product => 
    !selectedProductIds.includes(product.id)
  );

  const handleSelect = (productId: string) => {
    setSelectedProductId(productId);
    setNewProductPrice("");
  };

  const handleAddTaggedProduct = () => {
    if (!selectedProductId) {
      return;
    }

    const product = products.find(p => p.id === selectedProductId);
    if (!product) return;

    const newTaggedProduct: TaggedProduct = {
      product_id: selectedProductId,
      name: product.name,
      price: Number(newProductPrice) || 0
    };

    onTaggedProductsChange([...taggedProducts, newTaggedProduct]);
    setSelectedProductId("");
    setNewProductPrice("");
    setOpen(false);
  };

  const handleRemoveTag = (productId: string) => {
    onTaggedProductsChange(taggedProducts.filter(tp => tp.product_id !== productId));
  };

  const handlePriceChange = (productId: string, price: number) => {
    onTaggedProductsChange(taggedProducts.map(tp =>
      tp.product_id === productId ? { ...tp, price } : tp
    ));
  };

  return (
    <div className="space-y-4">
      <Label className="">สินค้าที่แนะนำ</Label>
      
      {/* Add new tagged product form */}
      <div className="flex flex-col sm:flex-row gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full sm:w-64 justify-between"
              disabled={isLoading || availableProducts.length === 0}
            >
              {isLoading ? (
                "กำลังโหลดสินค้า..."
              ) : availableProducts.length === 0 ? (
                "ไม่มีสินค้าให้เลือก"
              ) : selectedProductId ? (
                products.find(p => p.id === selectedProductId)?.name || "เลือกสินค้า"
              ) : (
                "เลือกสินค้า"
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
                  {availableProducts.map((product) => (
                    <CommandItem
                      key={product.id}
                      value={product.name}
                      onSelect={() => handleSelect(product.id)}
                    >
                      {product.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        
        <Input
          type="number"
          placeholder="ราคา"
          value={newProductPrice}
          onChange={(e) => setNewProductPrice(e.target.value)}
          className="w-full sm:w-32"
          min="0"
          step="0.01"
        />
        
        <Button
          type="button"
          onClick={handleAddTaggedProduct}
          className="w-full sm:w-auto"
          disabled={!selectedProductId}
        >
          เพิ่มสินค้า
        </Button>
      </div>

      {/* Tagged products table */}
      {taggedProducts.length > 0 && (
        <div className="border rounded-lg">
          <div className="bg-muted/50 px-4 py-2 border-b">
            <h4 className="font-medium">สินค้าที่แท็กแล้ว</h4>
          </div>
          <div className="divide-y">
            {taggedProducts.map((taggedProduct) => (
              <div key={taggedProduct.product_id} className="flex items-center justify-between p-4">
                <div className="flex-1">
                  <p className="font-medium">{taggedProduct.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={taggedProduct.price || ""}
                    onChange={(e) => handlePriceChange(taggedProduct.product_id, Number(e.target.value) || 0)}
                    className="w-24"
                    min="0"
                    step="0.01"
                  />
                  <span className="text-sm text-muted-foreground">บาท</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveTag(taggedProduct.product_id)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 