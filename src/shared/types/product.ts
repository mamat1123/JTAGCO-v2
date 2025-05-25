export interface Product {
  id: string;
  name: string;
  type: string;
  created_at: string;
  description: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  attributes: Record<string, string>;
  price: number;
  created_at: string;
  is_made_to_order: boolean;
  stock: number;
  product: Product;
}

export interface ProductVariantFormData {
  sku: string;
  attributes: Record<string, string>;
  price: number;
  is_made_to_order: boolean;
  stock: number;
} 