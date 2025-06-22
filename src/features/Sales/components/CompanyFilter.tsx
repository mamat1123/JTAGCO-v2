import { useState, useCallback, useRef, useEffect } from 'react';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Search, ChevronDown, ChevronUp, Loader2, X } from 'lucide-react';
import { Card } from '@/shared/components/ui/card';
import { cn } from '@/shared/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { PROVINCES } from '@/shared/constants/provinces';
import { ProfileSelect } from '@/features/Profile/components/ProfileSelect';
import { useProducts } from '@/features/Settings/Products/hooks/useProducts';

interface CompanyFilterProps {
  onFilterChange: (filters: CompanyFilters) => void;
}

export interface CompanyFilters {
  search: string;
  province: string;
  user_id: string;
  tagged_product_id: string;
}

export const CompanyFilter = ({ onFilterChange }: CompanyFilterProps) => {
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState<CompanyFilters>({
    search: '',
    province: 'all',
    user_id: 'all',
    tagged_product_id: 'all'
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const { data: products = [], isLoading: isLoadingProducts } = useProducts();

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleSearch = useCallback((value: string) => {
    setSearchInput(value);
    setIsSearching(true);

    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout
    searchTimeoutRef.current = setTimeout(() => {
      const newFilters = { ...filters, search: value };
      setFilters(newFilters);
      onFilterChange(newFilters);
      setIsSearching(false);
    }, 1000);
  }, [filters, onFilterChange]);

  const handleProvinceChange = (value: string) => {
    const newFilters = { ...filters, province: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleProfileChange = (value: string) => {
    const newFilters = { ...filters, user_id: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleProductChange = (value: string) => {
    const newFilters = { ...filters, tagged_product_id: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      province: 'all',
      user_id: 'all',
      tagged_product_id: 'all'
    };
    setFilters(clearedFilters);
    setSearchInput('');
    onFilterChange(clearedFilters);
  };

  return (
    <div className="w-full space-y-4 p-2 sm:p-4 bg-white rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0 sm:justify-between">
        <div className="relative w-full flex gap-2">
          <div className="relative flex-1">
            {isSearching ? (
              <Loader2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 animate-spin" />
            ) : (
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            )}
            <Input
              placeholder="ค้นหาชื่อบริษัทหรือรหัส..."
              className={cn(
                "pl-10 w-full transition-all duration-200",
                isSearching && "bg-gray-50"
              )}
              value={searchInput}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full sm:w-auto sm:ml-2"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-2" />
              ซ่อนตัวกรอง
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-2" />
              แสดงตัวกรอง
            </>
          )}
        </Button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <Card className="p-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div 
                  className="flex flex-col gap-2"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <label className="text-sm font-medium">จังหวัด</label>
                  <Select
                    value={filters.province}
                    onValueChange={handleProvinceChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกจังหวัด" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">ทั้งหมด</SelectItem>
                      {PROVINCES.map((province) => (
                        <SelectItem key={province.name} value={province.name}>
                          {province.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>

                <motion.div 
                  className="flex flex-col gap-2"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="text-sm font-medium">ผู้ดูแล</label>
                  <ProfileSelect
                    value={filters.user_id}
                    onValueChange={handleProfileChange}
                    placeholder="เลือกผู้ดูแล"
                  />
                </motion.div>

                <motion.div 
                  className="flex flex-col gap-2"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="text-sm font-medium">สินค้า (tag)</label>
                  <Select
                    value={filters.tagged_product_id}
                    onValueChange={handleProductChange}
                    disabled={isLoadingProducts}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={isLoadingProducts ? "กำลังโหลด..." : "เลือกสินค้า"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">ทั้งหมด</SelectItem>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id.toString()}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>
              </div>

              {(filters.search || filters.province !== 'all' || filters.user_id !== 'all' || filters.tagged_product_id !== 'all') && (
                <div className="flex justify-end mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    <span>ล้างตัวกรอง</span>
                  </Button>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}; 