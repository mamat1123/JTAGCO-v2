"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { EventRequest } from "@/entities/ShoeRequest/types";
import { RequestList } from "./components/RequestList";
import { Clock, Check, X, Package, Filter } from "lucide-react";
import { shoeRequestAPI } from "@/entities/ShoeRequest/shoeRequestAPI";
import { shoeReturnAPI } from "@/entities/ShoeReturn/shoeReturnAPI";

const ITEMS_PER_PAGE = 10;

export const ShoeRequestsPage = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [requests, setRequests] = useState<EventRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchRequests = useCallback(async (page: number, isLoadMore: boolean = false) => {
    try {
      if (isLoadMore) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      const response = await shoeRequestAPI.getAll({
        page,
        limit: ITEMS_PER_PAGE,
        status: statusFilter === "all" || statusFilter === "not_returned" ? undefined : statusFilter as "pending" | "approved" | "rejected",
      });

      let filteredData = response.data;
      
      // Filter for not_returned if needed
      if (statusFilter === "not_returned") {
        filteredData = response.data.map(eventRequest => ({
          ...eventRequest,
          products: eventRequest.products.filter(product => 
            product.status === "approved" && product.is_fully_returned === false
          )
        })).filter(eventRequest => eventRequest.products.length > 0);
      }

      if (isLoadMore) {
        setRequests(prev => [...prev, ...filteredData]);
      } else {
        setRequests(filteredData);
      }

      setHasMore(response.data.length === ITEMS_PER_PAGE);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    setCurrentPage(1);
    fetchRequests(1);
  }, [statusFilter, fetchRequests]);

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      fetchRequests(currentPage + 1, true);
    }
  };

  const handleApprove = async (productId: string, comment: string) => {
    try {
      await shoeRequestAPI.approve(productId, comment);
      // Refresh the list
      fetchRequests(1);
    } catch (error) {
      console.error("ไม่สามารถอนุมัติคำขอได้:", error);
    }
  };

  const handleReject = async (productId: string, comment: string) => {
    try {
      await shoeRequestAPI.reject(productId, comment);
      // Refresh the list
      fetchRequests(1);
    } catch (error) {
      console.error("ไม่สามารถปฏิเสธคำขอได้:", error);
    }
  };

  const handleReceive = async (eventShoeVariantId: string, shoeRequestId: string, comment: string, quantity: number) => {
    try {
      await shoeReturnAPI.receive(eventShoeVariantId, shoeRequestId, comment, quantity);
      // Refresh the list
      fetchRequests(1);
    } catch (error) {
      console.error("ไม่สามารถรับคืนสินค้าได้:", error);
    }
  };

  // Calculate counts from the new structure
  const pendingCount = requests.reduce((count, eventRequest) => 
    count + eventRequest.products.filter(p => p.status === "pending").length, 0
  );
  const approvedCount = requests.reduce((count, eventRequest) => 
    count + eventRequest.products.filter(p => p.status === "approved").length, 0
  );
  const rejectedCount = requests.reduce((count, eventRequest) => 
    count + eventRequest.products.filter(p => p.status === "rejected").length, 0
  );
  const notReturnedCount = requests.reduce((count, eventRequest) => 
    count + eventRequest.products.filter(p => p.status === "approved" && p.is_fully_returned === false).length, 0
  );
  const totalCount = requests.reduce((count, eventRequest) => 
    count + eventRequest.products.length, 0
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">ระบบอนุมัติการเบิกรองเท้า</h1>
          <p className="text-gray-600">จัดการคำขอเบิกรองเท้าทั้งหมด</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingCount}</p>
                  <p className="text-sm text-gray-600">รอการอนุมัติ</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{approvedCount}</p>
                  <p className="text-sm text-gray-600">อนุมัติแล้ว</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                  <X className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{rejectedCount}</p>
                  <p className="text-sm text-gray-600">ไม่อนุมัติ</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalCount}</p>
                  <p className="text-sm text-gray-600">ทั้งหมด</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Package className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{notReturnedCount}</p>
                  <p className="text-sm text-gray-600">ยังไม่ได้คืน</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="กรองตามสถานะ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทั้งหมด</SelectItem>
                    <SelectItem value="pending">รอการอนุมัติ</SelectItem>
                    <SelectItem value="approved">อนุมัติแล้ว</SelectItem>
                    <SelectItem value="rejected">ไม่อนุมัติ</SelectItem>
                    <SelectItem value="not_returned">ยังไม่ได้คืน</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Request List */}
        <RequestList 
          requests={requests} 
          isLoading={isLoading}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
          error={null}
          onApprove={handleApprove}
          onReject={handleReject}
          onReceive={handleReceive}
        />
      </div>
    </div>
  );
}; 