import { useState, useEffect } from "react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { BarChart, LineChart, Activity, Users, DollarSign, ShoppingCart } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";

// Import the Calendar component
import { Calendar } from "@/features/Sales/components/CalendarEvent";
import { CalendarService } from "@/features/Sales/services/CalendarService";
import { CalendarEvent } from "@/entities/Calendar/calendar";
import { CompaniesList } from "@/features/Sales/components/CompaniesList";

export function SaleDashboardPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const activeTab = searchParams.get('tab') || 'calendar';

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const calendarEvents = await CalendarService.fetchEvents();
        setEvents(calendarEvents);
      } catch (error) {
        console.error("Failed to fetch calendar events:", error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">แดชบอร์ดการขาย</h1>

      {/* Sales Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">รายได้รวม</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">฿45,231.89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% จากเดือนที่แล้ว
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ลูกค้าใหม่</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2,350</div>
            <p className="text-xs text-muted-foreground">
              +10.1% จากเดือนที่แล้ว
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ยอดขาย</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12,234</div>
            <p className="text-xs text-muted-foreground">
              +19% จากเดือนที่แล้ว
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">กำลังใช้งาน</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">
              +201 จากชั่วโมงที่แล้ว
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different views */}
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="calendar">ปฏิทิน</TabsTrigger>
          {/* <TabsTrigger value="analytics">วิเคราะห์</TabsTrigger> */}
          <TabsTrigger value="customers">ลูกค้า</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="p-0 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>ปฏิทินกิจกรรมการขาย</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-96">
                  <p className="text-muted-foreground">กำลังโหลดข้อมูลปฏิทิน...</p>
                </div>
              ) : (
                <Calendar events={events} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="p-0 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>วิเคราะห์การขาย</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center py-10">
              <div className="flex flex-col items-center space-y-2">
                <LineChart className="h-16 w-16 text-muted-foreground" />
                <p className="text-muted-foreground">ข้อมูลการวิเคราะห์จะแสดงที่นี่</p>
                <Button variant="outline" className="mt-4">สร้างรายงาน</Button>
              </div>
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