import { useEffect, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import { Plus, X, Check } from "lucide-react";
import type { ProductVariant, CreateProductVariantDTO } from "@/entities/Product/product";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/components/ui/command";
import { cn } from "@/shared/lib/utils";

interface ProductVariantFormSingleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant?: ProductVariant;
  onSubmit: (data: CreateProductVariantDTO) => void;
}

export function ProductVariantFormSingleDialog({
  open,
  onOpenChange,
  variant,
  onSubmit,
}: ProductVariantFormSingleDialogProps) {
  const [formData, setFormData] = useState<CreateProductVariantDTO>({
    product_id: "",
    sku: "",
    attributes: {},
    price: 0,
    stock: 0,
    is_made_to_order: false,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingAttribute, setIsAddingAttribute] = useState(false);
  const [newAttributeKey, setNewAttributeKey] = useState("");

  useEffect(() => {
    if (variant) {
      setFormData({
        product_id: variant.product_id,
        sku: variant.sku,
        attributes: variant.attributes,
        price: variant.price,
        stock: variant.stock,
        is_made_to_order: false,
      });
    }
  }, [variant]);

  const handleAttributeChange = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [key]: value,
      },
    }));
  };

  useEffect(() => {
   console.log(variant);
  }, [variant]);

  const addNewAttribute = () => {
    setIsAddingAttribute(true);
  };

  const handleAddAttribute = (key: string) => {
    setFormData((prev) => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [key]: "",
      },
    }));
    setIsAddingAttribute(false);
    setNewAttributeKey("");
  };

  const removeAttribute = (key: string) => {
    setFormData((prev) => {
      const newAttributes = { ...prev.attributes };
      delete newAttributes[key];
      return {
        ...prev,
        attributes: newAttributes,
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const commonAttributes = [
    "size",
    "color",
    "image",
    "steel_plate",
    "has_insole",
    "has_toe_cap",
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {variant ? "Edit Product Variant" : "Add Product Variant"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sku">SKU</Label>
            <Input
              id="sku"
              value={formData.sku}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, sku: e.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Attributes</Label>
            <div className="space-y-2">
              {Object.entries(formData.attributes).map(([key, value], index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-1">
                    <span className="text-sm font-medium">{key}</span>
                    <Input
                      value={value}
                      onChange={(e) => handleAttributeChange(key, e.target.value)}
                      placeholder={`Enter ${key} value`}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeAttribute(key)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              {isAddingAttribute ? (
                <Command className="border rounded-md">
                  <CommandInput
                    placeholder="Search or type attribute name..."
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                  />
                  <CommandList>
                    <CommandEmpty>No attributes found</CommandEmpty>
                    <CommandGroup>
                      {commonAttributes
                        .filter(attr => !Object.keys(formData.attributes).includes(attr))
                        .map((attr) => (
                          <CommandItem
                            key={attr}
                            value={attr}
                            onSelect={() => handleAddAttribute(attr)}
                          >
                            <span>{attr}</span>
                            <Check className="ml-auto h-4 w-4" />
                          </CommandItem>
                        ))}
                      {searchQuery && !commonAttributes.includes(searchQuery) && (
                        <CommandItem
                          value={searchQuery}
                          onSelect={() => handleAddAttribute(searchQuery)}
                        >
                          <span>Add "{searchQuery}"</span>
                          <Plus className="ml-auto h-4 w-4" />
                        </CommandItem>
                      )}
                    </CommandGroup>
                  </CommandList>
                </Command>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addNewAttribute}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Attribute
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  price: parseFloat(e.target.value),
                }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stock">Stock</Label>
            <Input
              id="stock"
              type="number"
              value={formData.stock}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  stock: parseInt(e.target.value),
                }))
              }
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_made_to_order"
              checked={formData.is_made_to_order}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  is_made_to_order: checked,
                }))
              }
            />
            <Label htmlFor="is_made_to_order">Made to Order</Label>
          </div>

          <DialogFooter>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 