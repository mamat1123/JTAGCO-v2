import { ShoeReturn, ShoeReturnWithDetails } from './shoeReturn';

class ShoeReturnAPI {
  private baseUrl = '/api/shoe-returns';

  async getAll(): Promise<ShoeReturnWithDetails[]> {
    const response = await fetch(this.baseUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch shoe returns');
    }
    return response.json();
  }

  async create(data: Omit<ShoeReturn, 'id' | 'createdAt' | 'returnedAt'>): Promise<ShoeReturn> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create shoe return');
    }
    return response.json();
  }

  async getById(id: string): Promise<ShoeReturnWithDetails> {
    const response = await fetch(`${this.baseUrl}/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch shoe return');
    }
    return response.json();
  }
}

export const shoeReturnAPI = new ShoeReturnAPI(); 