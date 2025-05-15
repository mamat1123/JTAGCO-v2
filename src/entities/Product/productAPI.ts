import { Product, CreateProductDTO, UpdateProductDTO, ProductVariant, CreateProductVariantDTO, UpdateProductVariantDTO } from './product';
import { api } from '@/shared/config/api';

export const productAPI = {
  // Product operations
  async getProducts(): Promise<Product[]> {
    const response = await api.get<Product[]>('/products');
    return response.data;
  },

  async getProduct(id: string): Promise<Product> {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  async createProduct(product: CreateProductDTO): Promise<Product> {
    const response = await api.post<Product>('/products', product);
    return response.data;
  },

  async updateProduct(id: string, product: Partial<CreateProductDTO>): Promise<Product> {
    const response = await api.patch<Product>(`/products/${id}`, product);
    return response.data;
  },

  async deleteProduct(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  },

  // Variant operations
  async getProductVariants(productId: string): Promise<ProductVariant[]> {
    const response = await api.get<ProductVariant[]>(`/products/${productId}/variants`);
    return response.data;
  },

  async createProductVariant(variant: CreateProductVariantDTO): Promise<ProductVariant> {
    const response = await api.post<ProductVariant>(`/products/${variant.product_id}/variants`, variant);
    return response.data;
  },

  async createMultipleProductVariants(variants: CreateProductVariantDTO[]): Promise<ProductVariant[]> {
    const response = await api.post<ProductVariant[]>('/product-variants/multiple', variants);
    return response.data;
  },

  async updateProductVariant(id: string, variant: Partial<CreateProductVariantDTO>): Promise<ProductVariant> {
    const response = await api.put<ProductVariant>(`/product-variants/${id}`, variant);
    return response.data;
  },

  async deleteProductVariant(id: string): Promise<void> {
    await api.delete(`/product-variants/${id}`);
  },
}; 