import { ShoeReturn, ShoeReturnWithDetails } from './shoeReturn';
import { api } from '@/shared/config/api';
import { AxiosError } from 'axios';

const API_BASE_URL = '/shoe-returns';

export const shoeReturnAPI = {
  getAll: async (): Promise<ShoeReturnWithDetails[]> => {
    const response = await api.get<ShoeReturnWithDetails[]>(API_BASE_URL);
    return response.data;
  },

  getById: async (id: string): Promise<ShoeReturnWithDetails | null> => {
    try {
      const response = await api.get<ShoeReturnWithDetails>(`${API_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  create: async (data: Omit<ShoeReturn, 'id' | 'createdAt' | 'returnedAt'>): Promise<ShoeReturn> => {
    const response = await api.post<ShoeReturn>(API_BASE_URL, data);
    return response.data;
  },

  receive: async (eventShoeVariantId: string, shoeRequestId: string, comment: string, quantity: number): Promise<void> => {
    await api.post(`${API_BASE_URL}/${eventShoeVariantId}/receive`, { shoeRequestId, comment, quantity });
  },
}; 