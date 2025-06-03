import { api } from '@/shared/config/api';

export interface SalesMetrics {
  newCompanies: number;
  newCompaniesChange: number;
  eventSuccessRate: number;
  eventSuccessRateChange: number;
  bestSalesUser: {
    userId: number;
    fullname: string;
    event_count: number;
  };
  createdEvents: number;
  createdEventsChange: number;
}

export const salesMetricsService = {
  getMetrics: async (): Promise<SalesMetrics> => {
    const response = await api.get<SalesMetrics>('/dashboard/sales/metrics');
    return response.data;
  },
}; 