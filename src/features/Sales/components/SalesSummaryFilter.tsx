import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Calendar } from '@/shared/components/ui/calendar';
import { Filter, ChevronDown, ChevronUp, Calendar as CalendarIcon } from 'lucide-react';
import { ProfileSelect } from '@/features/Profile/components/ProfileSelect';
import { EventStatus } from '@/shared/types/events';
import { useEventMainTypes } from '@/features/Events/hooks/useEventMainTypes';
import { useEventSubTypes, EventSubType } from '@/features/Events/hooks/useEventSubTypes';
import { useProducts } from '@/features/Settings/Products/hooks/useProducts';
import { motion, AnimatePresence } from 'framer-motion';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { th } from 'date-fns/locale';
import { cn } from '@/shared/lib/utils';
import { DateRange } from 'react-day-picker';

export interface SalesSummaryFilters {
  status: EventStatus | 'all';
  user_id: string;
  main_type_id: string;
  sub_type_id: string;
  tagged_product_id: string;
  scheduled_at_start: string;
  scheduled_at_end: string;
}

interface SalesSummaryFilterProps {
  onFilterChange: (filters: SalesSummaryFilters) => void;
}

export const SalesSummaryFilter = ({ onFilterChange }: SalesSummaryFilterProps) => {
  const today = new Date();
  const defaultFrom = startOfMonth(today);
  defaultFrom.setHours(defaultFrom.getHours() + 7, defaultFrom.getMinutes(), defaultFrom.getSeconds());
  const defaultTo = endOfMonth(today);
  defaultTo.setHours(defaultTo.getHours() + 7, defaultTo.getMinutes(), defaultTo.getSeconds());
  const [filters, setFilters] = useState<SalesSummaryFilters>({
    status: 'all',
    user_id: 'all',
    main_type_id: 'all',
    sub_type_id: 'all',
    tagged_product_id: 'all',
    scheduled_at_start: defaultFrom.toISOString(),
    scheduled_at_end: defaultTo.toISOString(),
  });
  const [isExpanded, setIsExpanded] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: defaultFrom,
    to: defaultTo,
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  const { data: mainTypes = [], isLoading: isLoadingMainTypes } = useEventMainTypes();
  const { data: subTypes = [], isLoading: isLoadingSubTypes } = useEventSubTypes(
    filters.main_type_id !== 'all' ? filters.main_type_id : undefined
  );
  const { data: products = [], isLoading: isLoadingProducts } = useProducts();

  const handleFilterChange = (key: keyof SalesSummaryFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    if (key === 'main_type_id') {
      newFilters.sub_type_id = 'all';
    }
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from) {
      const from = new Date(range.from);
      from.setHours(from.getHours() + 7, from.getMinutes(), from.getSeconds());
      
      let to = from;
      if (range?.to) {
        to = new Date(range.to);
        to.setHours(to.getHours() + 7, to.getMinutes(), to.getSeconds());
      }
      
      const newFilters = {
        ...filters,
        scheduled_at_start: from.toISOString(),
        scheduled_at_end: to.toISOString(),
      };
      setFilters(newFilters);
      onFilterChange(newFilters);
      if (range?.to) {
        setIsCalendarOpen(false);
      }
    }
  };

  const formatDateRange = () => {
    if (!dateRange?.from) return 'เลือกช่วงวันที่';
    const fromStr = format(dateRange.from, 'd MMM yyyy', { locale: th });
    const toStr = dateRange.to ? format(dateRange.to, 'd MMM yyyy', { locale: th }) : fromStr;
    return `${fromStr} - ${toStr}`;
  };

  return (
    <div className="w-full space-y-3 bg-muted/30 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span>ตัวกรองสำหรับสรุปยอด</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-1" />
              ซ่อน
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" />
              แสดง
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
            <div className="flex flex-row flex-wrap gap-3">
              {/* Date Range Filter */}
              <motion.div 
                className="flex flex-col gap-1.5"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.05 }}
              >
                <label className="text-xs font-medium text-muted-foreground">ช่วงวันที่</label>
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !dateRange?.from && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      <span className="text-sm">{formatDateRange()}</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={handleDateRangeChange}
                      numberOfMonths={2}
                      locale={th}
                    />
                  </PopoverContent>
                </Popover>
              </motion.div>

              {/* User Filter */}
              <motion.div 
                className="flex flex-col gap-1.5"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <label className="text-xs font-medium text-muted-foreground">เซลล์</label>
                <ProfileSelect
                  value={filters.user_id}
                  onValueChange={(value) => handleFilterChange('user_id', value)}
                  placeholder="เลือกเซลล์"
                />
              </motion.div>

              {/* Status Filter */}
              <motion.div 
                className="flex flex-col gap-1.5"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
              >
                <label className="text-xs font-medium text-muted-foreground">สถานะ</label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => handleFilterChange('status', value)}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="เลือกสถานะ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทั้งหมด</SelectItem>
                    <SelectItem value={EventStatus.PLANNED}>ยังไม่เช็คอิน</SelectItem>
                    <SelectItem value={EventStatus.COMPLETED}>เช็คอิน</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>

              {/* Main Type Filter */}
              <motion.div 
                className="flex flex-col gap-1.5"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <label className="text-xs font-medium text-muted-foreground">ประเภทหลัก</label>
                <Select
                  value={filters.main_type_id}
                  onValueChange={(value) => handleFilterChange('main_type_id', value)}
                  disabled={isLoadingMainTypes}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder={isLoadingMainTypes ? "กำลังโหลด..." : "เลือกประเภทหลัก"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทั้งหมด</SelectItem>
                    {mainTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>

              {/* Sub Type Filter */}
              <motion.div 
                className="flex flex-col gap-1.5"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.25 }}
              >
                <label className="text-xs font-medium text-muted-foreground">ประเภทย่อย</label>
                <Select
                  value={filters.sub_type_id}
                  onValueChange={(value) => handleFilterChange('sub_type_id', value)}
                  disabled={isLoadingSubTypes || filters.main_type_id === 'all'}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder={
                      isLoadingSubTypes 
                        ? "กำลังโหลด..." 
                        : filters.main_type_id === 'all'
                          ? "เลือกประเภทหลักก่อน"
                          : "เลือกประเภทย่อย"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทั้งหมด</SelectItem>
                    {subTypes.map((type: EventSubType) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>

              {/* Product Filter */}
              <motion.div 
                className="flex flex-col gap-1.5"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <label className="text-xs font-medium text-muted-foreground">สินค้า (tag)</label>
                <Select
                  value={filters.tagged_product_id}
                  onValueChange={(value) => handleFilterChange('tagged_product_id', value)}
                  disabled={isLoadingProducts}
                >
                  <SelectTrigger className="w-[160px]">
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

              {/* Reset Button */}
              <motion.div 
                className="flex flex-col gap-1.5 justify-end"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.35 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const today = new Date();
                    const defaultFrom = startOfMonth(today);
                    defaultFrom.setHours(defaultFrom.getHours() + 7, defaultFrom.getMinutes(), defaultFrom.getSeconds());
                    const defaultTo = endOfMonth(today);
                    defaultTo.setHours(defaultTo.getHours() + 7, defaultTo.getMinutes(), defaultTo.getSeconds());
                    const defaultRange = {
                      from: defaultFrom,
                      to: defaultTo,
                    };
                    const resetFilters = {
                      status: 'all' as const,
                      user_id: 'all',
                      main_type_id: 'all',
                      sub_type_id: 'all',
                      tagged_product_id: 'all',
                      scheduled_at_start: defaultFrom.toISOString(),
                      scheduled_at_end: defaultTo.toISOString(),
                    };
                    setDateRange(defaultRange);
                    setFilters(resetFilters);
                    onFilterChange(resetFilters);
                  }}
                >
                  <Filter className="mr-1 h-3 w-3" />
                  รีเซ็ต
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
