"use client"

import * as React from "react"
import {
  Command,
  Settings2,
  DollarSign,
  ChartPie,
  Bell,
  ShieldUser,
  UserRound
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

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
          url: "/sale-dashboard",
        },
        {
          title: "ข้อมูลลูกค้าของฉัน",
          url: "#",
        },
        {
          title: "ข้อมูลพนักงานขาย",
          url: "#",
        },
      ],
    },
    {
      title: "Notification",
      url: "#",
      icon: Bell,
      isActive: true,
      items: [
        {
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
          url: "#",
        },
        {
          title: "สร้างใบเสนอราคา",
          url: "#",
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
      url: "#",
      icon: Settings2,
    },
  ],
}

export function DashboardSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
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
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
