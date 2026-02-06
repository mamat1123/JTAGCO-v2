import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { startOfMonth, endOfMonth } from "date-fns";

import { useEvents } from "@/features/Events/services/eventService";
import { Calendar } from "@/features/Events/components/CalendarEvent";
import { CompaniesList } from "@/features/Sales/components/CompaniesList";
import { EventsList } from "@/features/Events/components/EventsList";
import { SalesMetrics } from "./components/SalesMetrics";
import { SalesSummaryCards } from "./components/SalesSummaryCards";
import { salesMetricsService } from "./services/salesMetricsService";
import { useState } from "react";
import { EventStatus } from "@/shared/types/events";

export function SaleDashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "calendar";

  const [currentDate, setCurrentDate] = useState(new Date());
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    user_id: 'all',
    main_type_id: 'all',
    sub_type_id: 'all',
    tagged_product_id: 'all'
  });

  const { data: metrics, isLoading: isLoadingMetrics } = useQuery({
    queryKey: ["salesMetrics"],
    queryFn: salesMetricsService.getMetrics,
  });

  const { data: _events = [], isLoading: isLoadingStats } = useEvents({
    search: filters.search || undefined,
    status: filters.status !== 'all' ? filters.status as EventStatus : undefined,
    user_id: filters.user_id !== 'all' ? filters.user_id : undefined,
    main_type_id: filters.main_type_id !== 'all' ? filters.main_type_id : undefined,
    sub_type_id: filters.sub_type_id !== 'all' ? filters.sub_type_id : undefined,
    tagged_product_id: filters.tagged_product_id !== 'all' ? filters.tagged_product_id : undefined,
    scheduled_at_start: startOfMonth(currentDate).toISOString(),
    scheduled_at_end: endOfMonth(currentDate).toISOString(),
  });

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">แดชบอร์ดการขาย</h1>

      {/* Sales Metrics */}
      {!isLoadingMetrics && metrics && <SalesMetrics {...metrics} />}

      {/* Sales Person Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            สรุปยอดรายเซลล์ —{" "}
            {currentDate.toLocaleString("th-TH", {
              month: "long",
              year: "numeric",
            })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SalesSummaryCards
            isLoading={isLoadingStats}
            filters={{
              ...filters,
              scheduled_at_start: startOfMonth(currentDate).toISOString(),
              scheduled_at_end: endOfMonth(currentDate).toISOString(),
            }}
          />
        </CardContent>
      </Card>

      {/* Tabs for different views */}
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="calendar">ปฏิทิน</TabsTrigger>
          <TabsTrigger value="list">รายการกิจกรรม</TabsTrigger>
          <TabsTrigger value="customers">ลูกค้า</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="p-0 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>ปฏิทินกิจกรรมการขาย</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                currentDate={currentDate}
                onDateChange={setCurrentDate}
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="p-0 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>รายการกิจกรรมการขาย</CardTitle>
            </CardHeader>
            <CardContent>
              <EventsList />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="p-0 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>ข้อมูลลูกค้า</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center py-10">
              <CompaniesList />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
