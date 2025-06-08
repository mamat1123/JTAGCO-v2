import { Badge } from "./badge";
import { cn } from "@/shared/lib/utils";

interface StatusBadgeProps {
  status: "pending" | "approved" | "rejected";
  className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const variants = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  const labels = {
    pending: "รอการอนุมัติ",
    approved: "อนุมัติแล้ว",
    rejected: "ไม่อนุมัติ",
  };

  return (
    <Badge
      variant="secondary"
      className={cn(variants[status], className)}
    >
      {labels[status]}
    </Badge>
  );
}; 