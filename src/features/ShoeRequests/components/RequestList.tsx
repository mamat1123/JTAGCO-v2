"use client"

import { Button } from "@/shared/components/ui/button"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import {
  Eye,
  Loader2,
} from "lucide-react"
import { ShoeRequest } from "@/entities/ShoeRequest/types"
import { useRef, useCallback } from "react"

interface RequestListProps {
  requests: ShoeRequest[];
  isLoading: boolean;
  isLoadingMore?: boolean;
  onViewDetail: (request: ShoeRequest) => void;
  onLoadMore: () => void;
  hasMore?: boolean;
  error?: string | null;
}

export const RequestList = ({
  requests,
  isLoading,
  isLoadingMore,
  onViewDetail,
  onLoadMore,
  hasMore = true,
  error = null,
}: RequestListProps) => {
  const observer = useRef<IntersectionObserver | null>(null);

  const lastRequestElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        onLoadMore();
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore, onLoadMore]);

  const handleViewDetail = (request: ShoeRequest) => {
    onViewDetail(request)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            รอการอนุมัติ
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            อนุมัติแล้ว
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800">
            ไม่อนุมัติ
          </Badge>
        )
      default:
        return <Badge variant="outline">ไม่ทราบสถานะ</Badge>
    }
  }

  const getProductTypeBadge = (productType: string) => {
    return productType === "shoe" ? (
      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
        รองเท้า
      </Badge>
    ) : (
      <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700">
        แผ่นรองใน
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>เกิดข้อผิดพลาดในการโหลดข้อมูล: {error}</p>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center text-gray-500 p-4">
        <p>ไม่พบข้อมูลคำขอ</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Request List */}
      <div className="space-y-4">
        {requests.map((request, index) => (
          <Card
            key={request.id}
            className="hover:shadow-md transition-shadow"
            ref={index === requests.length - 1 ? lastRequestElementRef : null}
          >
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start sm:items-center gap-4 flex-1">
                  <img
                    src={request.attributes.image || "/placeholder.svg"}
                    alt={request.productName}
                    className="w-16 h-16 object-cover rounded-lg border flex-shrink-0"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg?height=64&width=64"
                    }}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-1">
                      <h3 className="font-semibold truncate">{request.requesterName}</h3>
                      {getProductTypeBadge(request.productType)}
                    </div>
                    <p className="text-sm text-gray-600 mb-2 truncate">{request.productName}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-gray-500">
                      <span>จำนวน {request.quantity} คู่</span>
                      <span className="hidden sm:inline">•</span>
                      <span>ไซส์ {request.attributes.size}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>สี{request.attributes.color}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>{formatDate(request.scheduledAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-3 sm:mt-0">
                  <div className="w-full sm:w-auto">{getStatusBadge(request.status)}</div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetail(request)}
                    className="w-full sm:w-auto"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    ดูรายละเอียด
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {isLoadingMore && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={onLoadMore}
            disabled={isLoadingMore}
          >
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              กำลังโหลด...
            </>
          </Button>
        </div>
      )}

      {!hasMore && requests.length > 0 && (
        <div className="text-center py-4 text-gray-500">
          ไม่มีข้อมูลเพิ่มเติม
        </div>
      )}
    </div>
  )
}
