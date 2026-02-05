import {
  Calendar,
  CheckCircle2,
  Percent,
  User,
  CheckCircle,
  Building2,
  Package,
  Search,
  Calendar as CalendarIcon,
  Receipt,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { useEvents } from "../../Events/services/eventService";
import { QueryEventDto, BackendEvent } from "@/shared/types/events";
import { Product } from "@/entities/Product/product";
import { format, startOfWeek } from "date-fns";
import { th } from "date-fns/locale";
import { useProducts } from "@/features/Settings/Products/hooks/useProducts";
import { useEffect } from "react";

const PO_SUB_TYPES = [26, 28];

interface SalesSummaryCardsProps {
  isLoading?: boolean;
  filters?: {
    search: string;
    status: string;
    user_id: string;
    main_type_id: string;
    sub_type_id: string;
    tagged_product_id: string;
    scheduled_at_start: string;
    scheduled_at_end: string;
  };
}

export function SalesSummaryCards({
  isLoading = false,
  filters,
}: SalesSummaryCardsProps) {
  const { data: events = [] } = useEvents({
    search: filters?.search || undefined,
    status:
      filters?.status !== "all"
        ? (filters?.status as QueryEventDto["status"])
        : undefined,
    user_id: filters?.user_id !== "all" ? filters?.user_id : undefined,
    main_type_id:
      filters?.main_type_id !== "all" ? filters?.main_type_id : undefined,
    sub_type_id:
      filters?.sub_type_id !== "all" ? filters?.sub_type_id : undefined,
    tagged_product_id:
      filters?.tagged_product_id !== "all"
        ? filters?.tagged_product_id
        : undefined,
    scheduled_at_start: filters?.scheduled_at_start,
    scheduled_at_end: filters?.scheduled_at_end,
  });

  const totalEvents = events?.length || 0;
  const completedEvents =
    events?.filter((event) => event.status === "completed").length || 0;
  const completionPercentage =
    totalEvents > 0 ? (completedEvents / totalEvents) * 100 : 0;

  const { data: products = [] } = useProducts();

  const getUserFullName = (
    userId: string | number,
    events: BackendEvent[],
  ): string => {
    const user = events.find((e) => e.user_id === Number(userId));
    return user?.userFullName || `User ${userId}`;
  };

  const getMainTypeName = (
    mainTypeId: string,
    events: BackendEvent[],
  ): string => {
    const mainType = events.find((e) => e.main_type_id === Number(mainTypeId));
    return mainType?.mainTypeName || `Type ${mainTypeId}`;
  };

  const getSubTypeName = (
    subTypeId: string,
    events: BackendEvent[],
  ): string => {
    const subType = events.find((e) => e.sub_type_id === Number(subTypeId));
    return subType?.subTypeName || `Type ${subTypeId}`;
  };

  const getProductName = (productId: string, products: Product[]): string => {
    const product = products.find((p) => p.id === productId);
    return product?.name || productId;
  };

  const formatThaiDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return format(date, "dd MMM 2569", { locale: th });
    } catch (error) {
      return dateString;
    }
  };

  const getWeekLabel = (date: Date): string => {
    const weekStart = startOfWeek(date, { weekStartsOn: 1 });
    return format(weekStart, "dd MMM 2569");
  };

  const getWeekPoVat = (events: BackendEvent[], weekStart: Date): number => {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const eventsInWeek = events.filter((event) => {
      const eventDate = new Date(event.scheduled_at);
      return eventDate >= weekStart && eventDate < weekEnd;
    });

    const poEvents = eventsInWeek.filter((event) =>
      PO_SUB_TYPES.includes(event.sub_type_id || 0),
    );
    console.log(poEvents);
    return poEvents.reduce((sum, event) => sum + Number(event.sales_before_vat || 0), 0);
  };

  const getCurrentMonthWeeks = (year: number, month: number): Date[] => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const weeks: Date[] = [];
    let currentWeek = startOfWeek(firstDayOfMonth, { weekStartsOn: 1 });

    weeks.push(currentWeek);

    while (currentWeek < lastDayOfMonth) {
      currentWeek = new Date(currentWeek);
      currentWeek.setDate(currentWeek.getDate() + 7);
      weeks.push(currentWeek);

      if (currentWeek > lastDayOfMonth) break;
    }

    return weeks;
  };

  const getFilterBadgeValue = (
    key: string,
    value: any,
    events: BackendEvent[],
    products: Product[],
  ): string => {
    switch (key) {
      case "user_id":
        return getUserFullName(value, events);
      case "status":
        return value === "planned" ? "ยังไม่เช็คอิน" : "เช็คอิน";
      case "main_type_id":
        return getMainTypeName(value, events);
      case "sub_type_id":
        return getSubTypeName(value, events);
      case "tagged_product_id":
        return getProductName(value, products);
      case "search":
        return value.length > 20 ? `${value.substring(0, 20)}...` : value;
      case "scheduled_at_start":
        return formatThaiDate(value);
      case "scheduled_at_end":
        return formatThaiDate(value);
      default:
        return String(value);
    }
  };

  function getFilterBadges(events: BackendEvent[] = []) {
    if (!filters) return [];

    const badgeComponents: React.ReactElement[] = [];

    // Check if both dates exist to combine them
    const hasStartDate =
      filters.scheduled_at_start && filters.scheduled_at_start !== "all";
    const hasEndDate =
      filters.scheduled_at_end && filters.scheduled_at_end !== "all";

    // Process non-date filters first
    const nonDateFilters: Record<
      string,
      { label: string; icon: React.ReactNode }
    > = {
      search: { label: "ค้นหา", icon: <Search className="mr-1 h-3 w-3" /> },
      status: {
        label: "สถานะ",
        icon: <CheckCircle className="mr-1 h-3 w-3" />,
      },
      user_id: { label: "เซลล์", icon: <User className="mr-1 h-3 w-3" /> },
      main_type_id: {
        label: "ประเภทหลัก",
        icon: <Building2 className="mr-1 h-3 w-3" />,
      },
      sub_type_id: {
        label: "ประเภทย่อย",
        icon: <Building2 className="mr-1 h-3 w-3" />,
      },
      tagged_product_id: {
        label: "สินค้า",
        icon: <Package className="mr-1 h-3 w-3" />,
      },
    };

    // Add date filter
    nonDateFilters.scheduled_at_start = {
      label: "วันที่",
      icon: <CalendarIcon className="mr-1 h-3 w-3" />,
    };

    Object.entries(filters).forEach(([key, value]) => {
      if (value === "all" || value === undefined || value === "") {
        return;
      }

      if (key === "scheduled_at_start" || key === "scheduled_at_end") {
        return; // Skip individual date filters - we'll handle them together
      }

      const badgeInfoMap = nonDateFilters[
        key as keyof typeof nonDateFilters
      ] || { label: key, icon: null };
      const formattedValue = getFilterBadgeValue(key, value, events, products);

      badgeComponents.push(
        <Badge key={key} className="bg-orange-100 text-orange-800 text-xs">
          <>
            {badgeInfoMap.icon}
            <span className="mr-1">{badgeInfoMap.label}</span>
            <span>{formattedValue}</span>
          </>
        </Badge>,
      );
    });

    // Add date badge if either date exists
    if (hasStartDate || hasEndDate) {
      const startDate = hasStartDate
        ? getFilterBadgeValue(
          "scheduled_at_start",
          filters.scheduled_at_start,
          events,
          products,
        )
        : "";
      const endDate = hasEndDate
        ? getFilterBadgeValue(
          "scheduled_at_end",
          filters.scheduled_at_end,
          events,
          products,
        )
        : "";
      const dateRange = endDate ? `${startDate} - ${endDate}` : startDate;

      badgeComponents.push(
        <Badge
          key="date_range"
          className="bg-orange-100 text-orange-800 text-xs"
        >
          <CalendarIcon className="mr-1 h-3 w-3" />
          <span className="mr-1">วันที่</span>
          <span>{dateRange}</span>
        </Badge>,
      );
    }

    return badgeComponents;
  }

  const filterBadges = getFilterBadges(events);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const weeks = getCurrentMonthWeeks(currentYear, currentMonth);

  useEffect(() => {
    console.log(
      weeks.map((weekStart) => ({
        weekLabel: getWeekLabel(weekStart),
        total: getWeekPoVat(events, weekStart),
      })),
    );
  }, [weeks]);
  const weeklyPoVat = weeks
    .map((weekStart) => ({
      weekLabel: getWeekLabel(weekStart),
      total: getWeekPoVat(events, weekStart),
    }))
    .filter(({ total }) => total > 0);

  const monthPoVat = weeks.reduce((sum, weekStart) => {
    return sum + getWeekPoVat(events, weekStart);
  }, 0);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                รอโหลดข้อมูล
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[60px] animate-pulse bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              จำนวนกิจกรรมทั้งหมด
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEvents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              กิจกรรมที่สำเร็จแล้ว
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedEvents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              อัตราส่วนการสำเร็จ
            </CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completionPercentage.toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            ยอดขาย PO (ก่อน VAT) ต่อสัปดาห์
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {weeklyPoVat.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                ไม่มีข้อมูล PO ในเดือนี้
              </p>
            ) : (
              weeklyPoVat.map(({ weekLabel, total }) => (
                <div
                  key={weekLabel}
                  className="flex justify-between items-center text-xs"
                >
                  <span className="text-muted-foreground">{weekLabel}</span>
                  <span className="font-semibold">
                    {total.toLocaleString()} บาท
                  </span>
                </div>
              ))
            )}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">รวมเดือนนี้</span>
                <span className="text-lg font-bold text-primary">
                  {monthPoVat.toLocaleString()} บาท
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {filterBadges.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {filterBadges.map((badge, _index) => badge)}
        </div>
      )}
    </div>
  );
}
