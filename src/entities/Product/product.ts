export enum ProductType {
  SHOE = 'shoe',
  INSOLE = 'insole',
  TOE_CAP = 'toe_cap',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ProductAttributes = Record<string, any>;

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  attributes: ProductAttributes;
  price: number;
  stock: number;
  created_at: string;
}

export interface Product {
  id: string;
  type: ProductType;
  name: string;
  description?: string;
  variants?: ProductVariant[];
  priority?: number;
}

export interface CreateProductDTO {
  type: ProductType;
  name: string;
  description?: string;
  priority?: number;
}

export interface CreateProductVariantDTO {
  product_id: string;
  sku?: string;
  attributes: ProductAttributes;
  price: number;
  stock: number;
  is_made_to_order: boolean;
}

export interface UpdateProductDTO extends Partial<CreateProductDTO> {
  id: string;
}

export interface UpdateProductVariantDTO extends Partial<CreateProductVariantDTO> {
  id: string;
} 