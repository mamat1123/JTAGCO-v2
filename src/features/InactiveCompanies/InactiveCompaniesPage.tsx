"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { CalendarDays, Building2, Users, CreditCard, MapPin, GitBranch } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table"
import { Badge } from "@/shared/components/ui/badge"
import { companyAPI } from "@/entities/Company/companyAPI"
import { useQuery } from "@tanstack/react-query"
import { formatThaiDate } from "@/shared/utils/dateUtils"
import { useNavigate } from "react-router-dom"

type SortOption = "last_event_updated_at" | "credit" | "total_employees"

export const InactiveCompaniesPage = () => {
  const [monthsBack, setMonthsBack] = useState("3")
  const [sortBy, setSortBy] = useState<SortOption>("last_event_updated_at")
  const [page, setPage] = useState(1)
  const [allCompanies, setAllCompanies] = useState<any[]>([])
  const limit = 100
  const loadingRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate();
  const { data, isLoading, error } = useQuery({
    queryKey: ["inactiveCompanies", monthsBack, page, limit, sortBy],
    queryFn: () => companyAPI.getInactiveCompanies({ months: Number(monthsBack), page, limit, sortBy }),
  })

  const { data: stateData, error: stateError } = useQuery({
    queryKey: ["state", monthsBack],
    queryFn: () => companyAPI.getInactiveCompanyStats(Number(monthsBack)),
  })

  const hasMore = data ? allCompanies.length < (stateData?.total_companies || 0) : false

  // Update allCompanies when new data arrives
  useEffect(() => {
    if (data?.data) {
      if (page === 1) {
        setAllCompanies(data.data)
      } else {
        setAllCompanies(prev => [...prev, ...data.data])
      }
    }
  }, [data?.data, page])

  // Infinite scroll observer
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [target] = entries
    if (target.isIntersecting && hasMore && !isLoading) {
      setPage(prev => prev + 1)
    }
  }, [hasMore, isLoading])

  useEffect(() => {
    const element = loadingRef.current
    if (!element) return

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '20px',
      threshold: 0.1
    })

    observer.observe(element)
    return () => observer.unobserve(element)
  }, [handleObserver])

  const notHaveEventPercentage = stateData?.never_updated ? ((stateData?.never_updated / stateData?.total_companies) * 100).toFixed(2) : 0

  const formatCreditDays = (days: number) => {
    return `${days} วัน`
  }

  const handleSortChange = (value: SortOption) => {
    setSortBy(value)
    setPage(1)
  }

  if (error || stateError) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="flex items-center justify-center">
            <div className="text-lg text-red-600">เกิดข้อผิดพลาดในการโหลดข้อมูล</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">บริษัทที่ไม่ได้ใช้งาน</h1>
          <p className="text-gray-600">บริษัทที่ไม่มีกิจกรรมอัปเดตในช่วงเวลาที่เลือก</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">จำนวนบริษัททั้งหมด</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stateData?.total_companies || 0}</div>
              <p className="text-xs text-muted-foreground">ไม่มีการใช้งานในช่วง {monthsBack} เดือนที่ผ่านมา</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">จำนวนรองเท้าที่จะขายได้</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stateData?.total_employees || 0} คู่
              </div>
              <p className="text-xs text-muted-foreground">จากทุกบริษัทที่ไม่ได้ใช้งาน</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">เงื่อนไขเครดิตเฉลี่ย</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stateData?.avg_credit || 0} วัน
              </div>
              <p className="text-xs text-muted-foreground">เงื่อนไขการชำระเงินเฉลี่ย</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">สัดส่วนบริษัทที่ไม่เคยมี event</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {notHaveEventPercentage}%
              </div>
              <p className="text-xs text-muted-foreground">
                {stateData?.never_updated} บริษัทจากทั้งหมด{" "}
                {stateData?.total_companies} บริษัท
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>ตัวกรองและการเรียงลำดับ</CardTitle>
            <CardDescription>ปรับแต่งมุมมองของบริษัทที่ไม่ได้ใช้งาน</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="space-y-2">
                <label className="text-sm font-medium">ช่วงเวลา</label>
                <Select value={monthsBack} onValueChange={setMonthsBack}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 เดือน</SelectItem>
                    <SelectItem value="2">2 เดือน</SelectItem>
                    <SelectItem value="3">3 เดือน</SelectItem>
                    <SelectItem value="4">4 เดือน</SelectItem>
                    <SelectItem value="5">5 เดือน</SelectItem>
                    <SelectItem value="6">6 เดือน</SelectItem>
                    <SelectItem value="7">7 เดือน</SelectItem>
                    <SelectItem value="8">8 เดือน</SelectItem>
                    <SelectItem value="9">9 เดือน</SelectItem>
                    <SelectItem value="10">10 เดือน</SelectItem>
                    <SelectItem value="11">11 เดือน</SelectItem>
                    <SelectItem value="12">12 เดือน</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">เรียงตาม</label>
                <Select value={sortBy} onValueChange={(value) => handleSortChange(value as SortOption)}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last_event_updated_at">กิจกรรมล่าสุด (ใหม่ไปเก่า)</SelectItem>
                    <SelectItem value="credit">เงื่อนไขเครดิต (มากไปน้อย)</SelectItem>
                    <SelectItem value="total_employees">พนักงาน (มากไปน้อย)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Companies Table */}
        <Card>
          <CardHeader>
            <CardTitle>รายชื่อบริษัท</CardTitle>
            <CardDescription>
              พบ {stateData?.total_companies || 0} บริษัทที่ไม่มีกิจกรรมอัปเดตในช่วง {monthsBack} เดือนที่ผ่านมา
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">ชื่อบริษัท</TableHead>
                    <TableHead className="min-w-[150px]">กิจกรรมล่าสุด</TableHead>
                    <TableHead className="min-w-[120px]">จังหวัด</TableHead>
                    <TableHead className="min-w-[120px]">สาขา</TableHead>
                    <TableHead className="min-w-[100px] text-right">พนักงาน</TableHead>
                    <TableHead className="min-w-[120px] text-right">เงื่อนไขเครดิต</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allCompanies.map((company) => (
                    <TableRow key={company.id} className="hover:bg-muted/50 cursor-pointer" onClick={() => {
                      navigate(`/companies/${company.id}`)
                    }}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          {company.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-muted-foreground" />
                          <span className={!company.lastEventUpdatedAt ? "text-red-600 font-medium" : ""}>
                            {formatThaiDate(company.lastEventUpdatedAt)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <Badge variant="outline" className="text-xs">
                            {company.province || "ไม่มีจังหวัด"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <GitBranch className="h-4 w-4 text-muted-foreground" />
                          <Badge variant="secondary" className="text-xs">
                            {company.branch || "ไม่มีสาขา"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{(company.totalEmployees || 0).toLocaleString()}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <CreditCard className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{formatCreditDays(company.credit || 0)}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {allCompanies.length === 0 && !isLoading && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">ไม่พบบริษัทที่ไม่ได้ใช้งาน</h3>
                <p className="text-sm text-muted-foreground">
                  ทุกบริษัทมีกิจกรรมอัปเดตในช่วง {monthsBack} เดือนที่ผ่านมา
                </p>
              </div>
            )}

            {/* Loading indicator */}
            <div ref={loadingRef} className="py-4 text-center">
              {isLoading && (
                <div className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                  <span className="text-sm text-muted-foreground">กำลังโหลดข้อมูลเพิ่มเติม...</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}