import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatThaiDate } from "@/shared/utils/dateUtils";
import { Button } from "@/shared/components/ui/button";

interface TrackingStep {
  id: number;
  title: string;
  description: string;
  date: string;
  status: "completed" | "current" | "pending";
}

interface TrackingTimelineProps {
  steps: TrackingStep[];
  onReceiveProduct?: () => void;
}

export function TrackingTimeline({ steps, onReceiveProduct }: TrackingTimelineProps) {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

      <div className="space-y-6">
        {steps.map((step, _) => (
          <div key={step.id} className="relative flex gap-4">
            {/* Icon */}
            <div
              className={cn(
                "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2",
                step.status === "completed" && "border-green-500 bg-green-50",
                step.status === "current" && "border-blue-500 bg-blue-50",
                step.status === "pending" && "border-gray-300 bg-gray-50"
              )}
            >
              {step.status === "completed" && (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              )}
              {step.status === "current" && (
                <Clock className="h-4 w-4 text-blue-500" />
              )}
              {step.status === "pending" && (
                <AlertCircle className="h-4 w-4 text-gray-400" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h4
                  className={cn(
                    "font-medium",
                    step.status === "completed" && "text-green-700",
                    step.status === "current" && "text-blue-700",
                    step.status === "pending" && "text-gray-500"
                  )}
                >
                  {step.title}
                </h4>
                <span
                  className={cn(
                    "text-sm",
                    step.status === "completed" && "text-green-600",
                    step.status === "current" && "text-blue-600",
                    step.status === "pending" && "text-gray-400"
                  )}
                >
                  {formatThaiDate(step.date)}
                </span>
              </div>
              <p
                className={cn(
                  "text-sm",
                  step.status === "completed" && "text-green-600",
                  step.status === "current" && "text-blue-600",
                  step.status === "pending" && "text-gray-500"
                )}
              >
                {step.description}
              </p>
              {step.id === 3 && step.status === "current" && onReceiveProduct && (
                <Button
                  onClick={onReceiveProduct}
                  className="mt-2 bg-green-600 hover:bg-green-700 text-white"
                >
                  ได้รับสินค้าแล้ว
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 