import { Company, CompanyFilters, CompanyResponse, CreateCompanyDTO, UpdateCompanyDTO } from './company';
import { api } from '@/shared/config/api';
import { InactiveCompaniesDto, InactiveCompany, PaginatedResponse, InactiveCompanyStats } from "./company";
import { AxiosError } from 'axios';


export const companyAPI = {
  async getCompanies(filters: CompanyFilters = {}): Promise<CompanyResponse> {
    const response = await api.get<CompanyResponse>('/companies', { params: filters });
    return response.data;
  },

  async getCompany(id: string): Promise<Company> {
    const response = await api.get<Company>(`/companies/${id}`);
    return response.data;
  },

  async createCompany(company: CreateCompanyDTO): Promise<Company> {
    const response = await api.post<Company>('/companies', company);
    return response.data;
  },

  async updateCompany(id: string, company: Partial<UpdateCompanyDTO>): Promise<Company> {
    const { data } = await api.put<Company>(`/companies/${id}`, company);
    return data;
  },

  async deleteCompany(id: string): Promise<void> {
    await api.delete(`/companies/${id}`);
  },

  getInactiveCompanies: async (params: InactiveCompaniesDto): Promise<PaginatedResponse<InactiveCompany>> => {
    try {
      const response = await api.get<PaginatedResponse<InactiveCompany>>('/companies/inactive', {
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          months: params.months || 3,
          sortBy: params.sortBy,
          sortOrder: params.sortOrder,
          search: params.search,
          province: params.province,
          branch: params.branch,
        }
      });

      // Validate response data
      if (!response.data || !Array.isArray(response.data.data)) {
        throw new Error('Invalid response format');
      }

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to fetch inactive companies');
      }
      throw error;
    }
  },

  getInactiveCompanyStats: async (months: number): Promise<InactiveCompanyStats> => {
    try {
      const response = await api.get<InactiveCompanyStats>('/companies/inactive/stats', {
        params: {
          months: months || 3,
        }
      });

      // Validate response data
      if (!response.data || typeof response.data.total_companies !== 'number') {
        throw new Error('Invalid stats response format');
      }

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to fetch inactive company stats');
      }
      throw error;
    }
  },

  async transferCompany(id: string, userId: string): Promise<Company> {
    const response = await api.put<Company>(`/companies/${id}/transfer`, { user_id: userId });
    return response.data;
  },

  // Add new method for exporting inactive companies
  exportInactiveCompanies: async (params: InactiveCompaniesDto): Promise<Blob> => {
    try {
      const response = await api.get('/companies/inactive/export', {
        params: {
          months: params.months || 3,
          sortBy: params.sortBy,
          sortOrder: params.sortOrder,
          search: params.search,
          province: params.province,
          branch: params.branch,
        },
        responseType: 'blob'
      });

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'Failed to export inactive companies');
      }
      throw error;
    }
  },
}; 