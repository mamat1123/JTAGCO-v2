import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { CompaniesService } from "@/features/Sales/services/CompaniesService";
import { useEffect, useState, useRef, useCallback } from "react";
import { Company } from "@/entities/Company/company";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";
import { CompanyFilter, CompanyFilters } from "./CompanyFilter";
import { useProfile } from "@/features/Profile/hooks/useProfile";
import { UserRole } from "@/shared/types/roles";

export function CompaniesList() {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState<CompanyFilters>({
    search: '',
    province: 'all',
    user_id: 'all',
    tagged_product_id: 'all'
  });
  const observer = useRef<IntersectionObserver | null>(null);
  const itemsPerPage = 10;

  const lastCompanyElementRef = useCallback((node: HTMLTableRowElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const handleFilterChange = (newFilters: CompanyFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset page when filters change
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      console.log(profile);
      try {
        setLoading(true);
        const response = await CompaniesService.fetchCompanies({
          page,
          limit: itemsPerPage,
          tagged_product_id: filters.tagged_product_id === 'all' ? undefined : filters.tagged_product_id,
          search: filters.search,
          province: filters.province === 'all' ? undefined : filters.province,
          user_id: profile?.role === UserRole.SALES ? profile.id : (filters.user_id === 'all' ? undefined : filters.user_id)
        });
        
        if (page === 1) {
          setCompanies(response.data);
        } else {
          setCompanies(prevCompanies => [...prevCompanies, ...response.data]);
        }
        
        setHasMore(response.data.length === itemsPerPage);
        setError(null);
      } catch (error) {
        console.error('Error fetching companies:', error);
        setError('Failed to load companies');
        if (page === 1) {
          setCompanies([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [page, filters, profile?.role, profile?.user_id]);

  const handleRowClick = (companyId: string) => {
    navigate(`/companies/${companyId}`);
  };

  if (error && companies.length === 0) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-4 w-full">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        {/* Only show filter if user is not sales role */}
        {profile?.role !== UserRole.SALES && (
          <CompanyFilter onFilterChange={handleFilterChange} />
        )}
        <Button
          variant="default"
          size="sm"
          onClick={() => navigate('/companies/create')}
          className="flex items-center gap-2 whitespace-nowrap"
        >
          <Plus className="h-4 w-4" />
          <span>สร้างบริษัท</span>
        </Button>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <div className="min-w-[800px] md:min-w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px] md:w-[200px]">รหัสลูกค้า</TableHead>
                <TableHead className="min-w-[200px]">ชื่อบริษัท</TableHead>
                <TableHead className="min-w-[120px]">จังหวัด</TableHead>
                <TableHead className="min-w-[180px]">อีเมล</TableHead>
                <TableHead className="w-[100px]">เครดิต</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.map((company, index) => (
                <TableRow 
                  key={`${company.id}-${index}`}
                  ref={index === companies.length - 1 ? lastCompanyElementRef : null}
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleRowClick(company.id)}
                >
                  <TableCell className="font-medium truncate">{company.id}</TableCell>
                  <TableCell className="truncate max-w-[200px]">{company.name}</TableCell>
                  <TableCell className="truncate">{company.province || '-'}</TableCell>
                  <TableCell className="truncate max-w-[180px]">{company.email || '-'}</TableCell>
                  <TableCell className="truncate">{company.credit}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}

      {!hasMore && companies.length > 0 && (
        <div className="text-center py-4 text-gray-500">
          ไม่มีข้อมูลเพิ่มเติม
        </div>
      )}
    </div>
  );
}
