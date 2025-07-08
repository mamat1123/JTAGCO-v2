"use client"

import { Check, Clock, Package, UserCheck, Truck, RotateCcw } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { ApprovalDetails } from "./ApprovalDetails"
import type { EventTimelineStep } from "../services/eventTimelineService"

interface TrackingTimelineProps {
  steps: EventTimelineStep[]
  onReceiveProduct?: () => void
  onReturnProduct?: () => void
}

export function TrackingTimeline({ steps, onReceiveProduct, onReturnProduct }: TrackingTimelineProps) {
  const getStepIcon = (step: EventTimelineStep) => {
    const iconClass = "h-4 w-4"

    switch (step.id) {
      case 1:
        return <Package className={iconClass} />
      case 2:
        return <UserCheck className={iconClass} />
      case 3:
        return <Truck className={iconClass} />
      case 4:
        return <RotateCcw className={iconClass} />
      default:
        return <Clock className={iconClass} />
    }
  }

  const getStatusColor = (status: EventTimelineStep["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500 text-white"
      case "current":
        return "bg-blue-500 text-white"
      case "pending":
        return "bg-gray-200 text-gray-500"
      default:
        return "bg-gray-200 text-gray-500"
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString("th-TH", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getApprovalSummary = (data: Array<{ status: string }>) => {
    const approved = data.filter((item) => item.status === "approved").length
    const rejected = data.filter((item) => item.status === "rejected").length
    const pending = data.filter((item) => item.status === "pending").length
    const total = data.length

    const summary = `รวม ${total} รายการ: `
    const parts = []

    if (approved > 0) parts.push(`อนุมัติ ${approved} รายการ`)
    if (rejected > 0) parts.push(`ไม่อนุมัติ ${rejected} รายการ`)
    if (pending > 0) parts.push(`รอดำเนินการ ${pending} รายการ`)

    return summary + parts.join(", ")
  }

  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-start gap-4">
          <div className="flex flex-col items-center">
            <div className={`p-2 rounded-full ${getStatusColor(step.status)}`}>
              {step.status === "completed" ? <Check className="h-4 w-4" /> : getStepIcon(step)}
            </div>
            {index < steps.length - 1 && (
              <div className={`w-0.5 h-8 mt-2 ${step.status === "completed" ? "bg-green-200" : "bg-gray-200"}`} />
            )}
          </div>

          <div className="flex-1 pb-8">
            <div className="flex items-center justify-between">
              <h4
                className={`font-medium ${
                  step.status === "completed"
                    ? "text-green-700"
                    : step.status === "current"
                      ? "text-blue-700"
                      : "text-gray-500"
                }`}
              >
                {step.title}
              </h4>
              {step.date && <span className="text-xs text-gray-500">{formatDate(step.date)}</span>}
            </div>

            <p className="text-sm text-gray-600 mt-1">{step.description}</p>

            {/* Show approval summary if data exists */}
            {step.data && step.data.length > 0 && (
              <p className="text-xs text-blue-600 mt-2 font-medium bg-blue-50 px-2 py-1 rounded">
                {getApprovalSummary(step.data)}
              </p>
            )}

            {/* Show detailed approval information */}
            {step.data && step.data.length > 0 && <ApprovalDetails approvals={step.data} />}

            {/* Action buttons for current step */}
            {step.status === "current" && (
              <div className="mt-4 flex gap-2">
                {step.id === 3 && onReceiveProduct && (
                  <Button onClick={onReceiveProduct} className="bg-green-600 hover:bg-green-700 text-white" size="sm">
                    ยืนยันรับสินค้า
                  </Button>
                )}
                {step.id === 4 && onReturnProduct && (
                  <Button onClick={onReturnProduct} className="bg-blue-600 hover:bg-blue-700 text-white" size="sm">
                    ยืนยันคืนสินค้า
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
} 