import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

import { DashboardSidebar } from "@/features/dashboard/components/dashboard-sidebar";
import { Navbar } from "@/features/layout/components/navbar";
import { Outlet } from "react-router-dom";

export function DashboardLayout() {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <Navbar />
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Outlet />
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}