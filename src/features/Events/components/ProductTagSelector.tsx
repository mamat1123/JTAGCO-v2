import * as React from "react";
import { ChevronsUpDown, X, AlertCircle } from "lucide-react";
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
import { Product, ProductType } from "@/entities/Product/product";
import { NO_INSOLE_NAME } from "@/shared/constants/eventSubTypes";

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
  requireShoeAndInsole?: boolean;
  onValidationChange?: (isValid: boolean) => void;
  showValidation?: boolean;
}

export function ProductTagSelector({
  products,
  taggedProducts,
  onTaggedProductsChange,
  isLoading = false,
  requireShoeAndInsole = false,
  onValidationChange,
  showValidation = false,
}: ProductTagSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedProductId, setSelectedProductId] = React.useState<string>("");
  const [newProductPrice, setNewProductPrice] = React.useState<string>("");

  const selectedProductIds = taggedProducts.map(tp => tp.product_id);
  const availableProducts = products.filter(product =>
    !selectedProductIds.includes(product.id)
  );

  // Validation for shoe + insole requirement
  const validation = React.useMemo(() => {
    // Check if all products have valid prices (except "ไม่มีแผ่นรองใน")
    const productsWithInvalidPrice = taggedProducts.filter(tp => {
      if (tp.name === NO_INSOLE_NAME) return false; // Skip price validation for this product
      return !tp.price || tp.price <= 0;
    });

    const allPricesValid = productsWithInvalidPrice.length === 0;

    if (!requireShoeAndInsole) {
      return {
        isValid: allPricesValid,
        hasShoe: false,
        hasInsole: false,
        allPricesValid,
        productsWithInvalidPrice,
      };
    }

    const hasShoe = taggedProducts.some(tp => {
      const product = products.find(p => p.id === tp.product_id);
      return product?.type === ProductType.SHOE;
    });

    const hasInsole = taggedProducts.some(tp => {
      const product = products.find(p => p.id === tp.product_id);
      return product?.type === ProductType.INSOLE;
    });

    return {
      isValid: hasShoe && hasInsole && allPricesValid,
      hasShoe,
      hasInsole,
      allPricesValid,
      productsWithInvalidPrice,
    };
  }, [requireShoeAndInsole, taggedProducts, products]);

  // Notify parent about validation changes
  React.useEffect(() => {
    if (onValidationChange) {
      onValidationChange(validation.isValid);
    }
  }, [validation.isValid, onValidationChange]);

  const handleSelect = (productId: string) => {
    setSelectedProductId(productId);
    // Check if this is the "ไม่มีแผ่นรองใน" product
    const product = products.find(p => p.id === productId);
    if (product?.name === NO_INSOLE_NAME) {
      setNewProductPrice("0");
    } else {
      setNewProductPrice("");
    }
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

  // Check if a product is "ไม่มีแผ่นรองใน"
  const isNoInsoleProduct = (productId: string): boolean => {
    const taggedProduct = taggedProducts.find(tp => tp.product_id === productId);
    return taggedProduct?.name === NO_INSOLE_NAME;
  };

  // Check if the currently selected product is "ไม่มีแผ่นรองใน"
  const isSelectedNoInsole = React.useMemo(() => {
    const product = products.find(p => p.id === selectedProductId);
    return product?.name === NO_INSOLE_NAME;
  }, [selectedProductId, products]);

  return (
    <div className="space-y-4">
      <Label className="">สินค้าที่แนะนำ</Label>

      {/* Validation message */}
      {showValidation && requireShoeAndInsole && (!validation.hasShoe || !validation.hasInsole) && (
        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
          <AlertCircle className="h-4 w-4" />
          <span>
            กรุณาเลือกสินค้าให้ครบ:
            {!validation.hasShoe && " รองเท้า"}
            {!validation.hasShoe && !validation.hasInsole && " และ"}
            {!validation.hasInsole && " แผ่นรองใน"}
          </span>
        </div>
      )}

      {/* Price validation message */}
      {showValidation && !validation.allPricesValid && (
        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
          <AlertCircle className="h-4 w-4" />
          <span>กรุณากรอกราคาสินค้าให้ครบ</span>
        </div>
      )}

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
          disabled={isSelectedNoInsole}
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
                    disabled={isNoInsoleProduct(taggedProduct.product_id)}
                    aria-invalid={showValidation && !isNoInsoleProduct(taggedProduct.product_id) && (!taggedProduct.price || taggedProduct.price <= 0)}
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
