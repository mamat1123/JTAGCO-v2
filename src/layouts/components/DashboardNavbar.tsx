// src/features/layout/components/navbar.tsx
"use client"

import { DashboardModeToggle } from "@/layouts/components/DashboardModeToggle";
import {
  SidebarTrigger,
} from "@/shared/components/ui/sidebar";
import { Separator } from "@/shared/components/ui/separator";
import { DashboardSearchSelection } from "@/layouts/components/DashboardSearchSelection";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/components/ui/breadcrumb"
import { useLocation, useNavigate } from "react-router-dom"
import { useCompanyStore } from "@/features/Sales/stores/companyStore"

const routeNames: Record<string, string> = {
  '/dashboard': 'แดชบอร์ด',
  '/sales': 'การขาย',
  '/companies': 'รายการบริษัท',
  '/companies/:id': 'รายละเอียดบริษัท',
  '/companies/create': 'สร้างบริษัท',
  '/companies/:id/edit': 'แก้ไขข้อมูลบริษัท',
  '/billing': 'การชำระเงิน',
  '/settings': 'ตั้งค่า',
  '/help': 'ช่วยเหลือ',
}

export function DashboardNavbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const pathSegments = location.pathname.split('/').filter(Boolean)
  const { currentCompany } = useCompanyStore()

  const getRouteName = (path: string) => {
    // Handle dynamic routes
    if (path.includes(':')) {
      const basePath = path.split('/:')[0]
      return routeNames[path] || routeNames[basePath] || path
    }
    return routeNames[path] || path
  }

  const breadcrumbItems = pathSegments.map((_, index) => {
    const path = `/${pathSegments.slice(0, index + 1).join('/')}`
    const isLast = index === pathSegments.length - 1
    let routeName = getRouteName(path)

    // Replace company ID with company name in breadcrumb
    if (path.includes('/companies/') && currentCompany && !path.includes('edit') && !path.includes('create')) {
      routeName = currentCompany.name
    }

    return (
      <BreadcrumbItem key={path}>
        {isLast ? (
          <BreadcrumbPage>{routeName}</BreadcrumbPage>
        ) : (
          <BreadcrumbLink 
            href="#" 
            onClick={(e) => {
              e.preventDefault()
              navigate(path)
            }}
          >
            {routeName}
          </BreadcrumbLink>
        )}
        {!isLast && <BreadcrumbSeparator />}
      </BreadcrumbItem>
    )
  })

  return (
    <header className="flex h-16 shrink-0 justify-between items-center gap-2 border-b px-4">
      <div className="flex flex-row justify-center items-center">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb className="hidden md:block">
          <BreadcrumbList>
            {breadcrumbItems}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex items-center gap-4">
        <DashboardModeToggle />
        <DashboardSearchSelection />
        {/* {isAuthenticated ? (
          <>
            <Button variant="outline" size="sm" onClick={logout}>
              Log out
            </Button>
          </>
        ) : (
          <>
            <Link to="/login">
              <Button variant="outline" size="sm">Log in</Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Sign up</Button>
            </Link>
          </>
        )} */}
      </div>
    </header>
  );
}