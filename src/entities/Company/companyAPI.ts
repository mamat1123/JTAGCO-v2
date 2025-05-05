import { Company, CompanyFilters, CompanyResponse, CreateCompanyDTO } from './company';
import { api } from '@/shared/config/api';

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

  async updateCompany(id: string, company: Partial<Company>): Promise<Company> {
    const { data } = await api.put<Company>(`/companies/${id}`, company);
    return data;
  },

  async deleteCompany(id: string): Promise<void> {
    await api.delete(`/companies/${id}`);
  }
}; 