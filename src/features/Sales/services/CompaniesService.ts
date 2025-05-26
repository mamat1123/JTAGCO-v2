import { companyAPI } from '@/entities/Company/companyAPI';
import { Company, CompanyFilters, CompanyResponse, CreateCompanyDTO, UpdateCompanyDTO } from '@/entities/Company/company';

export class CompaniesService {
  static async fetchCompanies(filters: CompanyFilters = {}): Promise<CompanyResponse> {
    const response = await companyAPI.getCompanies(filters);
    return response;
  }

  static async fetchCompany(id: string): Promise<Company> {
    return companyAPI.getCompany(id);
  }

  static async createCompany(company: CreateCompanyDTO): Promise<Company> {    
    return companyAPI.createCompany(company);
  }

  static async updateCompany(id: string, company: Partial<UpdateCompanyDTO>): Promise<Company> {
    return companyAPI.updateCompany(id, company);
  }

  static async deleteCompany(id: string): Promise<void> {
    return companyAPI.deleteCompany(id);
  }

  static async searchCompanies(query: string): Promise<Company[]> {
    const response = await companyAPI.getCompanies({ search: query });
    return response.data;
  }
}
