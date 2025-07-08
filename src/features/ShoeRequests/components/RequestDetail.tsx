"use client"

import { useState, useCallback, useRef } from "react"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Textarea } from "@/shared/components/ui/textarea"
import { Label } from "@/shared/components/ui/label"
import { Separator } from "@/shared/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/components/ui/dialog"
import { Check, X, Calendar, Package, MessageSquare, Clock, Hash, Shield, User, MapPin, RotateCcw, CheckCircle } from "lucide-react"
import type { EventRequest } from "@/entities/ShoeRequest/types"

// Mock date formatter
const formatThaiDate = (date: string) => {
  return new Date(date).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

const formatThaiDateTime = (date: string) => {
  const dateObj = new Date(date)
  // Add 7 hours for UTC+7
  dateObj.setHours(dateObj.getHours() + 7)

  return dateObj.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

interface RequestDetailProps {
  request: EventRequest
  isOpen: boolean
  onClose: () => void
  onApprove: (productId: string, comment: string) => void
  onReject: (productId: string, comment: string) => void
  onReceive: (eventShoeVariantId: string, shoeRequestId: string, comment: string, quantity: number) => void
}

// Enhanced Returns Section Component
const ReturnsSection = ({ returns }: { returns: EventRequest['products'][0]['returns'] }) => {
  if (returns.length === 0) return null

  const totalReturned = returns.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <>
      <Separator />
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium flex items-center gap-2">
            <RotateCcw className="h-4 w-4 text-green-600" />
            ประวัติการรับคืน
          </h4>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            รับคืนแล้ว {totalReturned} คู่
          </Badge>
        </div>

        <div className="space-y-3">
          {returns.map((returnItem, index) => (
            <Card key={returnItem.id} className="border-l-4 border-l-green-500 bg-green-50/30">
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Header with return number and quantity */}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                        ครั้งที่ {index + 1}
                      </Badge>
                      <span className="text-sm font-medium text-green-700">{returnItem.quantity} คู่</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      {formatThaiDateTime(returnItem.returned_at)}
                    </div>
                  </div>

                  {/* Return reason */}
                  {returnItem.reason && (
                    <div className="bg-white/80 rounded-lg p-3 border border-green-100">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs font-medium text-green-700 mb-1">หมายเหตุการรับคืน</p>
                          <p className="text-sm text-gray-700 leading-relaxed">{returnItem.reason}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Returned by info */}
                  <div className="flex items-center gap-3 pt-2 border-t border-green-100">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs bg-green-100 text-green-700">
                          {returnItem.returner_name?.charAt(0) || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-gray-700">ผู้รับคืน</span>
                        <span className="text-xs text-gray-600">
                          {returnItem.returner_name || 'ไม่ระบุ'}
                        </span>
                      </div>
                    </div>
                    <div className="ml-auto">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary for multiple returns */}
        {returns.length > 1 && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-green-800">สรุปการรับคืน</span>
              <div className="flex items-center gap-4">
                <span className="text-green-700">
                  จำนวนครั้ง: <span className="font-semibold">{returns.length}</span>
                </span>
                <span className="text-green-700">
                  รวม: <span className="font-semibold">{totalReturned} คู่</span>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

// Separate ProductCard component to prevent re-renders
const ProductCard = ({
  product,
  comments,
  loadingStates,
  onUpdateComment,
  onApprove,
  onReject,
  onReceive
}: {
  product: EventRequest['products'][0]
  index: number
  comments: Record<string, string>
  loadingStates: Record<string, boolean>
  onUpdateComment: (productId: string, comment: string) => void
  onApprove: (productId: string) => void
  onReject: (productId: string) => void
  onReceive: (eventShoeVariantId: string, shoeRequestId: string, quantity: number, comment: string) => void
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdateComment(product.id, e.target.value)
  }

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{product.product_variant.products.name}</CardTitle>
          <div className="flex gap-2">
            {getProductTypeBadge(product.product_variant.products.type)}
            {getStatusBadge(product.status)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Product Details */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
              <Package className="h-12 w-12 text-gray-400" />
            </div>
          </div>
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-gray-500" />
                <span className="text-sm">จำนวน: {product.quantity} คู่</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-gray-500" />
                <span className="text-sm">ไซส์: {product.product_variant.attributes.size}</span>
              </div>
              {product.product_variant.attributes.color && (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-gray-300" />
                  <span className="text-sm">สี: {product.product_variant.attributes.color}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Requester Info */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <User className="h-4 w-4" />
            ผู้ขอเบิก
          </h4>
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/placeholder.svg?height=40&width=40" />
              <AvatarFallback>{product.requester.fullname.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{product.requester.fullname}</h3>
              <p className="text-sm text-gray-600">ผู้ขอเบิก</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {product.pickup_date && (
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">วันที่รับสินค้า</p>
                <p className="text-sm text-gray-600">{formatThaiDate(product.pickup_date)}</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-gray-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">วันที่คืน</p>
              <p className="text-sm text-gray-600">{formatThaiDate(product.return_date)}</p>
            </div>
          </div>
        </div>

        {/* Approver Info */}
        {product.approver && (
          <>
            <Separator />
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                ผู้อนุมัติ
              </h4>
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" />
                  <AvatarFallback>{product.approver.fullname.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{product.approver.fullname}</h3>
                  <p className="text-sm text-gray-600">ผู้อนุมัติ</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Reason */}
        {product.reason && (
          <>
            <Separator />
            <div>
              <p className="text-sm font-medium mb-2 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                เหตุผล/ความเห็น
              </p>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-700">{product.reason}</p>
              </div>
            </div>
          </>
        )}

        {/* Enhanced Returns Section */}
        <ReturnsSection returns={product.returns} />

        {/* Approval Section for Pending Products */}
        {product.status === "pending" && (
          <>
            <Separator />
            <div className="space-y-4">
              <h4 className="font-medium">การอนุมัติสินค้านี้</h4>
              <div>
                <Label htmlFor={`comment-${product.id}`}>ความเห็นเพิ่มเติม</Label>
                <Textarea
                  ref={textareaRef}
                  id={`comment-${product.id}`}
                  placeholder="กรอกความเห็นหรือข้อเสนอแนะ (ไม่บังคับ)"
                  value={comments[product.id] || ""}
                  onChange={handleCommentChange}
                  className="mt-1"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => onApprove(product.id)}
                  disabled={loadingStates[product.id]}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <Check className="h-4 w-4 mr-2" />
                  อนุมัติ
                </Button>
                <Button
                  onClick={() => onReject(product.id)}
                  disabled={loadingStates[product.id]}
                  variant="destructive"
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-2" />
                  ไม่อนุมัติ
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Receive Section for Approved Products */}
        {product.status === "approved" && (
          <>
            <Separator />
            <div className="space-y-4">
              <h4 className="font-medium">การรับคืนสินค้า</h4>
              <div>
                <Label htmlFor={`receive-comment-${product.id}`}>หมายเหตุการรับคืน</Label>
                <Textarea
                  id={`receive-comment-${product.id}`}
                  placeholder="กรอกหมายเหตุการรับคืน (ไม่บังคับ)"
                  value={comments[product.id] || ""}
                  onChange={handleCommentChange}
                  className="mt-1"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => onReceive(product.event_shoe_variant_id, product.id, product.quantity, comments[product.id] || "")}
                  disabled={loadingStates[product.id]}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Package className="h-4 w-4 mr-2" />
                  ได้รับคืน
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export const RequestDetail = ({ request, isOpen, onClose, onApprove, onReject, onReceive }: RequestDetailProps) => {
  const [comments, setComments] = useState<Record<string, string>>({})
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})

  const handleApprove = async (productId: string) => {
    setLoadingStates(prev => ({ ...prev, [productId]: true }))
    try {
      await onApprove(productId, comments[productId] || "")
      onClose()
    } catch (error) {
      console.error("Error approving request:", error)
    } finally {
      setLoadingStates(prev => ({ ...prev, [productId]: false }))
    }
  }

  const handleReject = async (productId: string) => {
    setLoadingStates(prev => ({ ...prev, [productId]: true }))
    try {
      await onReject(productId, comments[productId] || "")
      onClose()
    } catch (error) {
      console.error("Error rejecting request:", error)
    } finally {
      setLoadingStates(prev => ({ ...prev, [productId]: false }))
    }
  }

  const handleReceive = async (eventShoeVariantId: string, shoeRequestId: string, quantity: number, comment: string) => {
    setLoadingStates(prev => ({ ...prev, [shoeRequestId]: true }))
    try {
      await onReceive(eventShoeVariantId, shoeRequestId, comment, quantity)
      onClose()
    } catch (error) {
      console.error("Error receiving request:", error)
    } finally {
      setLoadingStates(prev => ({ ...prev, [shoeRequestId]: false }))
    }
  }

  const updateComment = useCallback((productId: string, comment: string) => {
    setComments((prev) => ({ ...prev, [productId]: comment }))
  }, [])

  const getEventTypeBadge = useCallback((mainType: string, subType?: string | null) => {
    const displayText = subType ? `${mainType} - ${subType}` : mainType
    return (
      <Badge variant="outline" className="bg-gray-50 text-gray-700">
        {displayText}
      </Badge>
    )
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-gray-900">รายละเอียดคำขอเบิก</DialogTitle>
          <DialogDescription className="text-center">รหัส Event: {request.event_id}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Information */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  ข้อมูล Event
                </CardTitle>
                {getEventTypeBadge(request.event.event_main_types.name, request.event.event_sub_types?.name)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">วันที่กำหนดการ</p>
                    <p className="text-sm text-gray-600">{formatThaiDate(request.event.scheduled_at)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Package className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">จำนวนสินค้า</p>
                    <p className="text-sm text-gray-600">{request.products.length} รายการ</p>
                  </div>
                </div>
              </div>

              {request.event.description && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium mb-2 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      รายละเอียด Event
                    </p>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-700">{request.event.description}</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Products List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Package className="h-5 w-5" />
              รายการสินค้าที่ขอเบิก ({request.products.length} รายการ)
            </h3>

            {request.products.map((product, index) => (
              <div key={product.id}>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="text-xs">
                    รายการที่ {index + 1}
                  </Badge>
                </div>
                <ProductCard
                  product={product}
                  index={index}
                  comments={comments}
                  loadingStates={loadingStates}
                  onUpdateComment={updateComment}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onReceive={handleReceive}
                />
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 