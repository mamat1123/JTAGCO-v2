"use client"

import { useState } from "react"
import { Button } from "@/shared/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Textarea } from "@/shared/components/ui/textarea"
import { Label } from "@/shared/components/ui/label"
import { Separator } from "@/shared/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/components/ui/dialog"
import { Check, X, Calendar, Package, MessageSquare, Clock, Hash, Palette, Shield, User } from "lucide-react"
import { ShoeRequest } from "@/entities/ShoeRequest/types"
import { formatThaiDate } from "@/shared/utils/dateUtils"

export const RequestDetail = ({
  request,
  isOpen,
  onClose,
  onApprove,
  onReject
}: {
  request: ShoeRequest;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (id: string, comment: string) => void;
  onReject: (id: string, comment: string) => void;
}) => {
  const [comment, setComment] = useState("")

  const handleApprove = () => {
    onApprove(request.id, comment)
  }

  const handleReject = () => {
    onReject(request.id, comment)
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-gray-900">
            รายละเอียดคำขอเบิก
          </DialogTitle>
          <DialogDescription className="text-center">
            รหัสคำขอ: {request.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Request Status */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">สถานะคำขอ</CardTitle>
                <div className="flex gap-2">
                  {getProductTypeBadge(request.productType)}
                  {getStatusBadge(request.status)}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Product Image */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                สินค้าที่ขอเบิก
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <img
                    src={request.attributes.image || "/placeholder.svg"}
                    alt={request.productName}
                    className="w-48 h-48 object-cover rounded-lg border"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg?height=200&width=200"
                    }}
                  />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{request.productName}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Hash className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">จำนวน: {request.quantity} คู่</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">ไซส์: {request.attributes.size}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Palette className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">สี: {request.attributes.color}</span>
                      </div>
                      {request.attributes.steel_plate && (
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            แผ่นเหล็ก: {request.attributes.steel_plate === "yes" ? "มี" : "ไม่มี"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Request Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                รายละเอียดคำขอ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Requester Info */}
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/placeholder.svg?height=48&width=48" />
                  <AvatarFallback>{request.requesterName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{request.requesterName}</h3>
                  <p className="text-sm text-gray-600">ผู้ขอเบิก</p>
                </div>
              </div>

              <Separator />

              {/* Request Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">วันที่ใช้งาน</p>
                      <p className="text-sm text-gray-600">{formatThaiDate(request.scheduledAt)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">วันที่คืน</p>
                      <p className="text-sm text-gray-600">{formatThaiDate(request.return_date)}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">ประเภทหลัก</p>
                    <p className="text-sm text-gray-600">{request.mainTypeName}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">ประเภทย่อย</p>
                    <p className="text-sm text-gray-600">{request.subTypeName}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Event Description */}
              <div>
                <p className="text-sm font-medium mb-2 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  รายละเอียดการใช้งาน
                </p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-700">{request.eventDescription}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Approver Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                ผู้อนุมัติ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/placeholder.svg?height=48&width=48" />
                  <AvatarFallback>{request.approverName?.charAt(0) || "A"}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{request.approverName}</h3>
                  <p className="text-sm text-gray-600">ผู้อนุมัติ</p>
                </div>
              </div>

              <Separator className="my-6"/>

              {/* Event Description */}
              <div className="space-y-4">
                <p className="text-sm font-medium mb-2 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  รายละเอียดการอนุมัติ
                </p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-700">{request.reason}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Approval Section */}
          {request.status === "pending" && (
            <Card>
              <CardHeader>
                <CardTitle>การอนุมัติ</CardTitle>
                <CardDescription>กรุณาพิจารณาคำขอและให้ความเห็นเพิ่มเติม</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="comment">ความเห็นเพิ่มเติม</Label>
                  <Textarea
                    id="comment"
                    placeholder="กรอกความเห็นหรือข้อเสนอแนะ (ไม่บังคับ)"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </CardContent>
              <CardContent className="flex flex-col sm:flex-row gap-3 pt-0">
                <Button
                  onClick={() => handleApprove()}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <Check className="h-4 w-4 mr-2" />
                  อนุมัติ
                </Button>
                <Button onClick={() => handleReject()} variant="destructive" className="flex-1">
                  <X className="h-4 w-4 mr-2" />
                  ไม่อนุมัติ
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
