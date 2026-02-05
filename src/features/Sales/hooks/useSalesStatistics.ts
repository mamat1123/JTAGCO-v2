import { useMemo } from "react";
import { useEvents } from "../../Events/services/eventService";
import { QueryEventDto } from "@/shared/types/events";

export interface SalesPersonRow {
  userFullName: string;
  userId: number;
  subTypeCounts: Map<number, number>;
  total: number;
}

export interface SubTypeColumn {
  id: number;
  name: string;
}

export interface SalesTableData {
  rows: SalesPersonRow[];
  subTypeColumns: SubTypeColumn[];
  grandTotal: number;
}

export function useSalesStatistics(query?: QueryEventDto) {
  const apiQuery = query
    ? {
        ...query,
        main_type_id:
          query.main_type_id && query.main_type_id !== "all"
            ? query.main_type_id
            : undefined,
        sub_type_id:
          query.sub_type_id && query.sub_type_id !== "all"
            ? query.sub_type_id
            : undefined,
      }
    : undefined;

  const { data: events, isLoading } = useEvents(apiQuery);

  const tableData = useMemo((): SalesTableData => {
    if (!events || isLoading) {
      return { rows: [], subTypeColumns: [], grandTotal: 0 };
    }

    // Collect unique sub-type columns
    const subTypeMap = new Map<number, string>();
    // Group events by user
    const userMap = new Map<
      number,
      { userFullName: string; subTypeCounts: Map<number, number>; total: number }
    >();

    for (const event of events) {
      const subTypeId = event.sub_type_id;
      if (!subTypeMap.has(subTypeId)) {
        subTypeMap.set(subTypeId, event.subTypeName || `Type ${subTypeId}`);
      }

      const userId = event.user_id;
      let userRow = userMap.get(userId);
      if (!userRow) {
        userRow = {
          userFullName: event.userFullName || `User ${userId}`,
          subTypeCounts: new Map(),
          total: 0,
        };
        userMap.set(userId, userRow);
      }

      userRow.subTypeCounts.set(
        subTypeId,
        (userRow.subTypeCounts.get(subTypeId) || 0) + 1
      );
      userRow.total++;
    }

    const subTypeColumns: SubTypeColumn[] = Array.from(subTypeMap.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.id - b.id);

    const rows: SalesPersonRow[] = Array.from(userMap.entries())
      .map(([userId, data]) => ({
        userId,
        userFullName: data.userFullName,
        subTypeCounts: data.subTypeCounts,
        total: data.total,
      }))
      .sort((a, b) => b.total - a.total);

    const grandTotal = rows.reduce((sum, row) => sum + row.total, 0);

    return { rows, subTypeColumns, grandTotal };
  }, [events, isLoading]);

  return { ...tableData, isLoading, events };
}
