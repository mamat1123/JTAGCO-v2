export enum ProductType {
  SHOE = 'shoe',
  INSOLE = 'insole',
  TOE_CAP = 'toe_cap',
}

export interface ProductAttributes {
  [key: string]: any;
}

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
}

export interface CreateProductDTO {
  type: ProductType;
  name: string;
  description?: string;
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