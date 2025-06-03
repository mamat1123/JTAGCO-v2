import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Building2, Target, Trophy, Calendar } from "lucide-react";

interface SalesMetricsProps {
  newCompanies: number;
  newCompaniesChange: number;
  eventSuccessRate: number;
  eventSuccessRateChange: number;
  bestSalesUser: {
    userId: number;
    fullname: string;
    event_count: number;
  };
  createdEvents: number;
  createdEventsChange: number;
}

export function SalesMetrics({
  newCompanies,
  newCompaniesChange,
  eventSuccessRate,
  eventSuccessRateChange,
  bestSalesUser,
  createdEvents,
  createdEventsChange,
}: SalesMetricsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">บริษัทใหม่</CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{newCompanies}</div>
          <p className="text-xs text-muted-foreground">
            {newCompaniesChange >= 0 ? "+" : ""}{newCompaniesChange}% จากเดือนที่แล้ว
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">อัตราความสำเร็จ</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{eventSuccessRate}%</div>
          <p className="text-xs text-muted-foreground">
            {eventSuccessRateChange >= 0 ? "+" : ""}{eventSuccessRateChange}% จากเดือนที่แล้ว
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">พนักงานขายยอดเยี่ยม</CardTitle>
          <Trophy className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{bestSalesUser.fullname}</div>
          <p className="text-xs text-muted-foreground">
            {bestSalesUser.event_count} กิจกรรม
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">กิจกรรมที่สร้าง</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{createdEvents}</div>
          <p className="text-xs text-muted-foreground">
            {createdEventsChange >= 0 ? "+" : ""}{createdEventsChange}% จากเดือนที่แล้ว
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 