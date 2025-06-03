import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

// Import the Calendar component
import { Calendar } from "@/features/Events/components/CalendarEvent";
import { CompaniesList } from "@/features/Sales/components/CompaniesList";
import { EventsList } from "@/features/Events/components/EventsList";
import { SalesMetrics } from "./components/SalesMetrics";
import { salesMetricsService } from "./services/salesMetricsService";

export function SaleDashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'calendar';

  const { data: metrics, isLoading: isLoadingMetrics } = useQuery({
    queryKey: ['salesMetrics'],
    queryFn: salesMetricsService.getMetrics,
  });

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">แดชบอร์ดการขาย</h1>

      {/* Sales Metrics */}
      {!isLoadingMetrics && metrics && (
        <SalesMetrics {...metrics} />
      )}

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
              <Calendar />
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