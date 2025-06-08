export interface ShoeReturn {
  id: string;
  eventShoeVariantId: string;
  quantity: number;
  returnedBy: number;
  returnedAt: string;
  reason?: string;
  createdAt: string;
}

export interface ShoeReturnWithDetails extends ShoeReturn {
  eventName: string;
  shoeVariantName: string;
  returnedByName: string;
} 