export interface ShoeRequest {
  id: string;
  eventId: string;
  shoeVariantId: string;
  quantity: number;
  status: 'pending' | 'approved' | 'rejected';
  requestedBy: number;
  approvedBy?: number;
  approvedAt?: string;
  reason?: string;
  note?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShoeRequestWithDetails extends ShoeRequest {
  eventName?: string;
  shoeVariantName?: string;
  requestedByName?: string;
  approvedByName?: string;
} 