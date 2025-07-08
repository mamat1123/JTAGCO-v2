"use client"

import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Separator } from "@/shared/components/ui/separator"
import { Eye, Loader2, Calendar, User, Package } from "lucide-react"
import { useRef, useCallback, useState } from "react"
import type { EventRequest } from "@/entities/ShoeRequest/types"
import { RequestDetail } from "./RequestDetail"

// Mock date formatter
const formatThaiDateOnly = (date: string) => {
  return new Date(date).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

interface RequestListProps {
  requests: EventRequest[]
  isLoading: boolean
  isLoadingMore?: boolean
  onLoadMore: () => void
  hasMore?: boolean
  error?: string | null
  onApprove: (productId: string, comment: string) => Promise<void>
  onReject: (productId: string, comment: string) => Promise<void>
  onReceive: (eventShoeVariantId: string, shoeRequestId: string, comment: string, quantity: number) => Promise<void>
}

export const RequestList = ({
  requests,
  isLoading,
  isLoadingMore,
  onLoadMore,
  hasMore = true,
  error = null,
  onApprove,
  onReject,
  onReceive,
}: RequestListProps) => {
  const [selectedRequest, setSelectedRequest] = useState<EventRequest | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const observer = useRef<IntersectionObserver | null>(null)

  const lastRequestElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          onLoadMore()
        }
      })

      if (node) observer.current.observe(node)
    },
    [isLoading, hasMore, onLoadMore],
  )

  const handleViewDetail = (request: EventRequest) => {
    setSelectedRequest(request)
    setIsDetailOpen(true)
  }

  const handleCloseDetail = () => {
    setIsDetailOpen(false)
    setSelectedRequest(null)
  }

  // TODO: Implement approval logic
  // const handleApprove = (productId: string, comment: string) => {
  //   console.log("Approve product:", productId, "Comment:", comment)
  //   // Handle approval logic here
  //   alert(`อนุมัติสินค้า ID: ${productId}`)
  // }

  // TODO: Implement rejection logic
  // const handleReject = (productId: string, comment: string) => {
  //   console.log("Reject product:", productId, "Comment:", comment)
  //   // Handle rejection logic here
  //   alert(`ไม่อนุมัติสินค้า ID: ${productId}`)
  // }

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
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            อนุมัติแล้ว
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800">
            ไม่อนุมัติ
          </Badge>
        )
      case "returned":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            รับคืนแล้ว
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

  const getEventTypeBadge = (mainType: string, subType?: string | null) => {
    const displayText = subType ? `${mainType} - ${subType}` : mainType
    return (
      <Badge variant="outline" className="bg-gray-50 text-gray-700">
        {displayText}
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>เกิดข้อผิดพลาดในการโหลดข้อมูล: {error}</p>
      </div>
    )
  }

  if (requests.length === 0) {
    return (
      <div className="text-center text-gray-500 p-4">
        <p>ไม่พบข้อมูลคำขอ</p>
      </div>
    )
  }

  return (
    <>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="space-y-6">
          {requests.map((eventRequest, index) => (
            <Card
              key={eventRequest.event_id}
              className="hover:shadow-md transition-shadow"
              ref={index === requests.length - 1 ? lastRequestElementRef : null}
            >
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {formatThaiDateOnly(eventRequest.event.scheduled_at)}
                      </span>
                      {getEventTypeBadge(
                        eventRequest.event.event_main_types.name,
                        eventRequest.event.event_sub_types?.name,
                      )}
                    </div>
                    {eventRequest.event.description && (
                      <p className="text-sm text-gray-600">{eventRequest.event.description}</p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetail(eventRequest)}
                    className="w-full sm:w-auto"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    ดูรายละเอียด
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Package className="h-4 w-4" />
                    <span>สินค้า {eventRequest.products.length} รายการ</span>
                  </div>

                  <div className="space-y-3">
                    {eventRequest.products.map((product, productIndex) => (
                      <div key={product.id}>
                        {productIndex > 0 && <Separator className="my-3" />}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex items-start sm:items-center gap-4 flex-1">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Package className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-1">
                                <h4 className="font-medium truncate">{product.product_variant.products.name}</h4>
                                {getProductTypeBadge(product.product_variant.products.type)}
                              </div>
                              <div className="flex items-center gap-2 mb-2">
                                <User className="h-3 w-3 text-gray-400" />
                                <span className="text-sm text-gray-600">{product.requester.fullname}</span>
                              </div>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-gray-500">
                                <span>จำนวน {product.quantity} คู่</span>
                                <span className="hidden sm:inline">•</span>
                                <span>ไซส์ {product.product_variant.attributes.size}</span>
                                {product.pickup_date && (
                                  <>
                                    <span className="hidden sm:inline">•</span>
                                    <span>รับ: {formatThaiDateOnly(product.pickup_date)}</span>
                                  </>
                                )}
                                <span className="hidden sm:inline">•</span>
                                <span>คืน: {formatThaiDateOnly(product.return_date)}</span>
                              </div>
                              {product.approver && (
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs text-gray-500">อนุมัติโดย: {product.approver.fullname}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">{getStatusBadge(product.status)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {isLoadingMore && (
          <div className="flex justify-center pt-4">
            <Button variant="outline" onClick={onLoadMore} disabled={isLoadingMore}>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              กำลังโหลด...
            </Button>
          </div>
        )}

        {!hasMore && requests.length > 0 && <div className="text-center py-4 text-gray-500">ไม่มีข้อมูลเพิ่มเติม</div>}
      </div>

      {/* Request Detail Modal */}
      {selectedRequest && (
        <RequestDetail
          request={selectedRequest}
          isOpen={isDetailOpen}
          onClose={handleCloseDetail}
          onApprove={onApprove}
          onReject={onReject}
          onReceive={onReceive}
        />
      )}
    </>
  )
}
