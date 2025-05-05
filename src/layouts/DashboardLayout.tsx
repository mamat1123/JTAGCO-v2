import {
  SidebarInset,
  SidebarProvider,
} from "@/shared/components/ui/sidebar";

import { DashboardSidebar } from "@/layouts/components/DashboardSidebar";
import { DashboardNavbar } from "@/layouts/components/DashboardNavbar";
import { Outlet } from "react-router-dom";

export function DashboardLayout() {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <DashboardNavbar />
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Outlet />
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}