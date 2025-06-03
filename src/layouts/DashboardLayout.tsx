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
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}