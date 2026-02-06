import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import type { SalesPersonRow, SubTypeColumn } from "../hooks/useSalesStatistics";

interface SalesPersonTableProps {
  rows: SalesPersonRow[];
  subTypeColumns: SubTypeColumn[];
  grandTotal: number;
  isLoading: boolean;
}

export function SalesPersonTable({
  rows,
  subTypeColumns,
  grandTotal,
  isLoading,
}: SalesPersonTableProps) {
  if (isLoading) {
    return <div className="py-8 text-center text-muted-foreground">กำลังโหลด...</div>;
  }

  if (rows.length === 0) {
    return <div className="py-8 text-center text-muted-foreground">ไม่พบข้อมูล</div>;
  }

  // Compute column totals
  const columnTotals = new Map<number, number>();
  for (const col of subTypeColumns) {
    let colSum = 0;
    for (const row of rows) {
      colSum += row.subTypeCounts.get(col.id) || 0;
    }
    columnTotals.set(col.id, colSum);
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="sticky left-0 bg-background z-10">เซลล์</TableHead>
          {subTypeColumns.map((col) => (
            <TableHead key={col.id} className="text-center">
              {col.name}
            </TableHead>
          ))}
          <TableHead className="text-center">รวม</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.userId}>
            <TableCell className="sticky left-0 bg-background z-10 font-medium">
              {row.userFullName}
            </TableCell>
            {subTypeColumns.map((col) => (
              <TableCell key={col.id} className="text-center">
                {row.subTypeCounts.get(col.id) || 0}
              </TableCell>
            ))}
            <TableCell className="text-center font-semibold">{row.total}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell className="sticky left-0 z-10 font-bold">รวม</TableCell>
          {subTypeColumns.map((col) => (
            <TableCell key={col.id} className="text-center font-bold">
              {columnTotals.get(col.id) || 0}
            </TableCell>
          ))}
          <TableCell className="text-center font-bold">{grandTotal}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
