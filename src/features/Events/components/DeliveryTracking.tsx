"use client"

import { useState, useEffect } from "react"
import { MapPin, ChevronUp, ChevronDown } from "lucide-react"
import { Card, CardContent } from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Skeleton } from "@/shared/components/ui/skeleton"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shared/components/ui/collapsible"
import { TrackingTimeline } from "./TrackingTimeline"
import type { EventTimelineStep } from "../services/eventTimelineService"

interface DeliveryTrackingProps {
  eventId?: string
  initialSteps?: EventTimelineStep[]
  isLoadingTimeline?: boolean
  onReceiveProduct?: () => void
  onReturnProduct?: () => void
}

export function DeliveryTracking({ 
  eventId = "REQ-001", 
  initialSteps = [], 
  isLoadingTimeline = false,
  onReceiveProduct,
  onReturnProduct 
}: DeliveryTrackingProps) {
  const [isTrackingOpen, setIsTrackingOpen] = useState(false)
  const [trackingSteps, setTrackingSteps] = useState<EventTimelineStep[]>(initialSteps)

  useEffect(() => {
    if (initialSteps.length > 0) {
      setTrackingSteps(initialSteps)
    }
  }, [initialSteps])

  const handleReceiveProduct = () => {
    const currentDate = new Date().toISOString()
    setTrackingSteps((prev) =>
      prev.map((step) =>
        step.id === 3
          ? { ...step, status: "completed" as const, date: currentDate }
          : step.id === 4
            ? { ...step, status: "current" as const }
            : step,
      ),
    )
    onReceiveProduct?.()
  }

  const handleReturnProduct = () => {
    const currentDate = new Date().toISOString()
    setTrackingSteps((prev) =>
      prev.map((step) => (step.id === 4 ? { ...step, status: "completed" as const, date: currentDate } : step)),
    )
    onReturnProduct?.()
  }

  const completedSteps = trackingSteps.filter((step) => step.status === "completed").length

  if (trackingSteps.length === 0) {
    return null
  }

  return (
    <Collapsible open={isTrackingOpen} onOpenChange={setIsTrackingOpen}>
      <Card className="overflow-hidden border-blue-100 shadow-sm py-4">
        <CollapsibleTrigger asChild>
          <CardContent className="cursor-pointer hover:bg-blue-50/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-800 text-sm md:text-base">สถานะเบิกสินค้า</h3>
                  <p className="text-xs text-blue-600">คำขอเบิก: {eventId}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isLoadingTimeline ? (
                  <Skeleton className="h-6 w-24" />
                ) : (
                  <Badge variant="outline" className="text-blue-600 border-blue-200 text-xs md:text-sm">
                    {completedSteps}/{trackingSteps.length} เสร็จสิ้น
                  </Badge>
                )}
                {isTrackingOpen ? (
                  <ChevronUp className="h-5 w-5 text-blue-600" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-blue-600" />
                )}
              </div>
            </div>
          </CardContent>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="border-t border-blue-100">
            <CardContent className="p-6 bg-blue-50/30">
              {isLoadingTimeline ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <TrackingTimeline
                  steps={trackingSteps}
                  onReceiveProduct={handleReceiveProduct}
                  onReturnProduct={handleReturnProduct}
                />
              )}
            </CardContent>
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
} 