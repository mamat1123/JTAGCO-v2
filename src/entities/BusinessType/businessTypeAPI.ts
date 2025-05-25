import { BusinessTypeDto } from "./businessType";
import { api } from '@/shared/config/api';

export class BusinessTypeService {
  static async getAll(): Promise<BusinessTypeDto[]> {
    try {
      const { data } = await api.get<BusinessTypeDto[]>('/business-types');
      return data;
    } catch (error) {
      throw new Error('Failed to fetch business types');
    }
  }
} 