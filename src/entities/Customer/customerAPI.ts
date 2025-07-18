import { Customer, CustomerResponse, CustomerFilters, CreateCustomerDTO, UpdateCustomerDto } from "./customer";
import { api } from '@/shared/config/api';

export const customerAPI = {
  async getCustomers(filters: CustomerFilters = {}): Promise<CustomerResponse> {
    const response = await api.get<CustomerResponse>('/customers', { params: filters });
    return response.data;
  },

  async getCustomer(id: string): Promise<Customer> {
    const response = await api.get<Customer>(`/customers/${id}`);
    return response.data;
  },

  async createCustomer(customer: CreateCustomerDTO): Promise<Customer> {
    const response = await api.post<Customer>('/customers', customer);
    return response.data;
  },

  async updateCustomer(id: string, customer: Partial<UpdateCustomerDto>): Promise<Customer> {
    console.log('updateCustomer API');
    const response = await api.patch<Customer>(`/customers/${id}`, customer);
    return response.data;
  },

  async deleteCustomer(id: string): Promise<void> {
    await api.delete(`/customers/${id}`);
  }
}; 