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
      const queryParams: Record<string, string | number | undefined> = {
        page: params.page || 1,
        limit: params.limit || 10,
        months: params.months || 3,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder,
        search: params.search,
        province: params.province,
        branch: params.branch,
      };

      // Only add user_id if it exists and is not "all"
      if (params.user_id && params.user_id !== "all") {
        queryParams.user_id = params.user_id;
      }

      const response = await api.get<PaginatedResponse<InactiveCompany>>('/companies/inactive', {
        params: queryParams
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

  getInactiveCompanyStats: async (params: { months: number; user_id?: string; sortBy?: string; }): Promise<InactiveCompanyStats> => {
    try {
      const queryParams: Record<string, string | number | undefined> = {
        months: params.months || 3,
      };

      // Only add user_id and sortBy if they exist and user_id is not "all"
      if (params.user_id && params.user_id !== "all") {
        queryParams.user_id = params.user_id;
      }
      
      if (params.sortBy) {
        queryParams.sortBy = params.sortBy;
      }

      const response = await api.get<InactiveCompanyStats>('/companies/inactive/stats', {
        params: queryParams
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