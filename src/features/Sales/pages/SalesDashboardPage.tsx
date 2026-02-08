import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { SalesSummaryFilter, SalesSummaryFilters } from "@/features/Sales/components/SalesSummaryFilter";
import { SalesMetrics } from "@/features/Sales/components/SalesMetrics";
import { SalesSummaryCards } from "@/features/Sales/components/SalesSummaryCards";
import { useQuery } from "@tanstack/react-query";
import { salesMetricsService } from "@/features/Sales/services/salesMetricsService";
import { startOfMonth, endOfMonth, format } from "date-fns";
import { th } from "date-fns/locale";

export function SalesDashboardPage() {
  const today = new Date();
  const [filters, setFilters] = useState<SalesSummaryFilters>({
    status: "all",
    user_id: "all",
    main_type_id: "all",
    sub_type_id: "all",
    tagged_product_id: "all",
    scheduled_at_start: startOfMonth(today).toISOString(),
    scheduled_at_end: endOfMonth(today).toISOString(),
  });

  const { data: metrics, isLoading: isLoadingMetrics } = useQuery({
    queryKey: ["salesMetrics"],
    queryFn: salesMetricsService.getMetrics,
  });

  const handleFilterChange = (newFilters: SalesSummaryFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">แดชบอร์ดการขาย</h1>

      {/* Sales Metrics - ไม่มี filter */}
      {!isLoadingMetrics && metrics && <SalesMetrics {...metrics} />}

      {/* Filters สำหรับการ์ดสรุปยอดด้านล่าง */}
      <SalesSummaryFilter onFilterChange={handleFilterChange} />

      {/* Sales Summary Cards */}
      <Card>
        <CardHeader>
          <CardTitle>
            สรุปยอดรายเซลล์ —{" "}
            {(() => {
              const from = new Date(filters.scheduled_at_start);
              const to = new Date(filters.scheduled_at_end);
              const fromStr = format(from, 'd MMM yyyy', { locale: th });
              const toStr = format(to, 'd MMM yyyy', { locale: th });
              return fromStr === toStr ? fromStr : `${fromStr} - ${toStr}`;
            })()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SalesSummaryCards
            filters={{
              search: "",
              ...filters,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
