"use client"

import * as React from "react"
import { Button } from "@/shared/components/ui/button";
import { Link } from "react-router-dom";
import {
  Settings2,
  DollarSign,
  ChartPie,
  Bell,
  ShieldUser,
  UserRound
} from "lucide-react"

import { DashboardNavMain } from "@/layouts/components/DashboardNavMain"
import { DashboardNavSecondary } from "@/layouts/components/DashboardNavSecondary"
import { DashboardNavUser } from "@/layouts/components/DashboardNavUser"
import { useAuthStore } from "@/features/Auth/stores/authStore";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar"
import { useProfile } from "@/features/Profile/hooks/useProfile";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: ChartPie,
      // isActive: true,
      // items: [
      //   {
      //     title: "History",
      //     url: "#",
      //   },
      //   {
      //     title: "Starred",
      //     url: "#",
      //   },
      //   {
      //     title: "Settings",
      //     url: "#",
      //   },
      // ],
    },
    {
      title: "Sale",
      url: "#",
      icon: DollarSign,
      isActive: true,
      items: [
        {
          title: "ส่วนกลาง",
          url: "/sales",
        },
        {
          title: "ข้อมูลลูกค้าของฉัน",
          url: "/sales?tab=customers",
        },
        {
          disabled: true,
          title: "ข้อมูลพนักงานขาย",
          url: "#",
        },
      ],
    },
    {
      title: "Notification",
      url: "#",
      icon: Bell,
      isActive: false,
      items: [
        {
          disabled: true,
          title: "รอบการสั้งซื้อ",
          url: "#",
        },
      ],
    },
    {
      title: "Admin",
      url: "#",
      icon: ShieldUser,
      isActive: true,
      items: [
        {
          title: "อนุมัติเบิกสินค้า",
          url: "/admin/shoe-requests",
        },
        {
          title: "สร้างใบเสนอราคา",
          url: "#",
          disabled: true,
        },
      ],
    },
    {
      title: "Central",
      url: "#",
      icon: UserRound,
      // isActive: true,
      // items: [
      //   {
      //     title: "อนุมัติเบิกสินค้า",
      //     url: "#",
      //   },
      //   {
      //     title: "สร้างใบเสนอราคา",
      //     url: "#",
      //   },
      // ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
    },
  ],
}

export function DashboardSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { profile } = useProfile();
  const { isAuthenticated, logout } = useAuthStore();
  console.log(profile);
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <img src="/pwa-512x512.png" alt="JTAGCO" className="size-8" />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">JTAGCO</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <DashboardNavMain items={data.navMain} />
        <DashboardNavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <DashboardNavUser fullname={profile?.fullname} username={profile?.username} />
      </SidebarFooter>
      <SidebarFooter>
        {isAuthenticated ? (
          <>
            <Button className="text-black cursor-pointer" variant="outline" size="sm" onClick={logout}>
              Log out
            </Button>
          </>
        ) : (
          <>
            <Link to="/">
              <Button variant="outline" size="sm">Log in</Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Sign up</Button>
            </Link>
          </>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
