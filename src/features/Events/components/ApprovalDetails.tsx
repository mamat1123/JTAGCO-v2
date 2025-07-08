"use client"

import React from "react"
import { Check, X, Clock, Package, Tag, Calendar } from "lucide-react"
import { Badge } from "@/shared/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card"
import { Separator } from "@/shared/components/ui/separator"
import type { ApprovalData } from "../services/eventTimelineService"

interface ApprovalDetailsProps {
  approvals: ApprovalData[]
}

export function ApprovalDetails({ approvals }: ApprovalDetailsProps) {
  const getStatusIcon = (status: ApprovalData["status"]) => {
    switch (status) {
      case "approved":
        return <Check className="h-4 w-4 text-green-600" />
      case "rejected":
        return <X className="h-4 w-4 text-red-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <Package className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: ApprovalData["status"]) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">อนุมัติ</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 border-red-200">ไม่อนุมัติ</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">รอการอนุมัติ</Badge>
      case "returned":
        return <Badge className="bg-green-100 text-green-800 border-green-200">รับคืนแล้ว</Badge>
      default:
        return <Badge variant="outline">ไม่ทราบสถานะ</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(price)
  }

  const getAttributesDisplay = (attributes: Record<string, unknown>): (string | React.JSX.Element)[] => {
    if (!attributes) return []
    const entries = Object.entries(attributes)
    return entries.map(([key, value]) => {
      if (key === "image" && value) {
        return (
          <div key={key} className="flex items-center gap-2">
            <img 
              src={value as string} 
              alt="Product variant" 
              className="w-12 h-12 rounded-lg object-cover border-2 border-gray-200 shadow-sm"
            />
            <span className="text-xs text-gray-500">รูปสินค้า</span>
          </div>
        )
      }
      return `${key}: ${value}`
    })
  }

  return (
    <div className="space-y-4 mt-4">
      <h5 className="font-medium text-gray-700 text-sm flex items-center gap-2">
        <Package className="h-4 w-4" />
        รายละเอียดสินค้าที่ขอเบิก ({approvals.length} รายการ):
      </h5>

      {approvals.map((approval) => (
        <Card
          key={approval.id}
          className={`border-l-4 ${
            approval.status === "approved"
              ? "border-l-green-400"
              : approval.status === "rejected"
                ? "border-l-red-400"
                : "border-l-yellow-400"
          }`}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex flex-col md:flex-row items-start gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    approval.status === "approved"
                      ? "bg-green-100"
                      : approval.status === "rejected"
                        ? "bg-red-100"
                        : "bg-yellow-100"
                  }`}
                >
                  {getStatusIcon(approval.status)}
                </div>
                <div className="flex-1">
                  <h6 className="font-semibold text-gray-900 text-base">{approval.product_variants.products.name}</h6>
                  <div className="flex flex-col md:flex-row items-center gap-4 mt-1 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      SKU: {approval.product_variants.sku}
                    </span>
                    {approval.product_variants.attributes && (
                      <div className="flex items-center gap-3 flex-wrap">
                        {getAttributesDisplay(approval.product_variants.attributes).map((item, index) => (
                          <div key={index}>{item}</div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {getStatusBadge(approval.status)}
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">จำนวน:</span>
                  <span className="font-medium">{approval.quantity} ชิ้น</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ราคาต่อชิ้น:</span>
                  <span className="font-medium">{formatPrice(approval.product_variants.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">มูลค่ารวม:</span>
                  <span className="font-semibold text-blue-600">
                    {formatPrice(approval.product_variants.price * approval.quantity)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    วันที่รับ:
                  </span>
                  <span>{formatDate(approval.pickup_date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    วันที่คืน:
                  </span>
                  <span>{formatDate(approval.return_date)}</span>
                </div>
                {approval.approved_at && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">วันที่อนุมัติ:</span>
                    <span>{formatDate(approval.approved_at)}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">สต็อกคงเหลือ:</span>
                  <span
                    className={`font-medium ${approval.product_variants.stock > 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {approval.product_variants.stock} ชิ้น
                  </span>
                </div>
                {approval.reason && (
                  <div>
                    <span className="text-gray-600">เหตุผล:</span>
                    <p className="mt-1 text-gray-900 bg-gray-50 p-2 rounded text-sm">{approval.reason}</p>
                  </div>
                )}
              </div>
            </div>

            {approval.note && (
              <>
                <Separator className="my-4" />
                <div>
                  <span className="text-gray-600 text-sm">หมายเหตุ:</span>
                  <p className="mt-1 text-gray-900 bg-blue-50 p-3 rounded text-sm border-l-4 border-blue-200">
                    {approval.note}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Summary section */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-4">
          <h6 className="font-medium text-gray-900 mb-3">สรุปการเบิกสินค้า</h6>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {approvals.filter((item) => item.status === "approved").length}
              </div>
              <div className="text-gray-600">อนุมัติ</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {approvals.filter((item) => item.status === "rejected").length}
              </div>
              <div className="text-gray-600">ไม่อนุมัติ</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {approvals.filter((item) => item.status === "pending").length}
              </div>
              <div className="text-gray-600">รอดำเนินการ</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {formatPrice(
                  approvals
                    .filter((item) => item.status === "approved")
                    .reduce((sum, item) => sum + item.product_variants.price * item.quantity, 0),
                )}
              </div>
              <div className="text-gray-600">มูลค่ารวม</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 