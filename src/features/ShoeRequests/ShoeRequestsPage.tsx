"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { ShoeRequest } from "@/entities/ShoeRequest/types";
import { shoeRequestAPI } from "@/entities/ShoeRequest/shoeRequestAPI";
import { RequestList } from "./components/RequestList";
import { RequestDetail } from "./components/RequestDetail";
import { Clock, Check, X, Package, Filter } from "lucide-react";

const ITEMS_PER_PAGE = 10;

export const ShoeRequestsPage = () => {
  const [currentView, setCurrentView] = useState<"list" | "detail">("list");
  const [selectedRequest, setSelectedRequest] = useState<ShoeRequest | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [requests, setRequests] = useState<ShoeRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchRequests = async (page: number, isLoadMore: boolean = false) => {
    try {
      if (isLoadMore) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      const response = await shoeRequestAPI.getAll({
        page,
        limit: ITEMS_PER_PAGE,
        status: statusFilter === "all" ? undefined : statusFilter as any,
      });

      if (isLoadMore) {
        setRequests(prev => [...prev, ...response.data]);
      } else {
        setRequests(response.data);
      }

      setHasMore(response.hasMore);
      setCurrentPage(response.currentPage);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchRequests(1);
  }, [statusFilter]);

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      fetchRequests(currentPage + 1, true);
    }
  };

  const handleViewDetail = (request: ShoeRequest) => {
    setSelectedRequest(request);
    setCurrentView("detail");
  };

  const handleBackToList = () => {
    setCurrentView("list");
    setSelectedRequest(null);
  };

  const handleApprove = async (id: string, comment: string) => {
    try {
      await shoeRequestAPI.approve(id, comment);
      // Refresh the list
      const response = await shoeRequestAPI.getAll({
        page: 1,
        limit: ITEMS_PER_PAGE,
      });
      setRequests(response.data);
      handleBackToList();
    } catch (error) {
      console.error("ไม่สามารถอนุมัติคำขอได้:", error);
    }
  };

  const handleReject = async (id: string, comment: string) => {
    try {
      await shoeRequestAPI.reject(id, comment);
      // Refresh the list
      const response = await shoeRequestAPI.getAll({
        page: 1,
        limit: ITEMS_PER_PAGE,
      });
      setRequests(response.data);
      handleBackToList();
    } catch (error) {
      console.error("ไม่สามารถปฏิเสธคำขอได้:", error);
    }
  };

  const pendingCount = requests.filter((req) => req.status === "pending").length;
  const approvedCount = requests.filter((req) => req.status === "approved").length;
  const rejectedCount = requests.filter((req) => req.status === "rejected").length;

  if (currentView === "detail" && selectedRequest) {
    return (
      <RequestDetail
        request={selectedRequest}
        isOpen={currentView === "detail"}
        onClose={handleBackToList}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">ระบบอนุมัติการเบิกรองเท้า</h1>
          <p className="text-gray-600">จัดการคำขอเบิกรองเท้าทั้งหมด</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  <p className="text-2xl font-bold">{requests.length}</p>
                  <p className="text-sm text-gray-600">ทั้งหมด</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="ค้นหาด้วยชื่อ, รหัสคำขอ, หรือแผนก..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div> */}
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
          onViewDetail={handleViewDetail}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
          error={null}
        />
      </div>
    </div>
  );
}; 