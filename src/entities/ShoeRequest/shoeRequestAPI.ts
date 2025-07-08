import { ShoeRequest, ShoeRequestFilters, EventRequest } from './types';
import { api } from '@/shared/config/api';
import { AxiosError } from 'axios';

const API_BASE_URL = '/shoe-requests';

export const shoeRequestAPI = {
  getAll: async (filters?: ShoeRequestFilters): Promise<{ data: EventRequest[], total: number }> => {
    const response = await api.get<{ data: EventRequest[], total: number }>(API_BASE_URL, { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<ShoeRequest | null> => {
    try {
      const response = await api.get<ShoeRequest>(`${API_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  create: async (request: Omit<ShoeRequest, 'id'>): Promise<ShoeRequest> => {
    const response = await api.post<ShoeRequest>(API_BASE_URL, request);
    return response.data;
  },

  updateStatus: async (id: string, status: 'approved' | 'rejected', comment: string): Promise<void> => {
    await api.patch(`${API_BASE_URL}/${id}/status`, { status, reason: comment });
  },

  approve: async (id: string, comment: string): Promise<void> => {
    return shoeRequestAPI.updateStatus(id, 'approved', comment);
  },

  reject: async (id: string, comment: string): Promise<void> => {
    return shoeRequestAPI.updateStatus(id, 'rejected', comment);
  },

  
};