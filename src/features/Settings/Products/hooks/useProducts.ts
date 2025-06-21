import { useQuery } from '@tanstack/react-query';
import { productAPI } from '@/entities/Product/productAPI';
import { Product } from '@/entities/Product/product';
import { toast } from 'sonner';

export const useProducts = () => {
  return useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: async () => {
      try {
        return await productAPI.getProducts();
      } catch (error) {
        toast.error('Failed to fetch products');
        console.error('Error fetching products:', error);
        throw error;
      }
    },
  });
}; 