import { create } from 'zustand';
import { Company } from '@/entities/Company/company';
import { CompaniesService } from '@/features/Sales/services/CompaniesService';

interface CompanyState {
  currentCompany: Company | null;
  setCurrentCompany: (company: Company | null) => void;
  fetchCompany: (id: string) => Promise<void>;
}

export const useCompanyStore = create<CompanyState>()((set) => ({
  currentCompany: null,
  setCurrentCompany: (company) => set({ currentCompany: company }),
  fetchCompany: async (id: string) => {
    console.log('fetching company', id);
    try {
      const company = await CompaniesService.fetchCompany(id);
      console.log(company);
      set({ currentCompany: company });
    } catch (error) {
      console.error('Error fetching company:', error);
      set({ currentCompany: null });
    }
  },
})); 