import { useState, useEffect, useCallback, useRef } from 'react';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Search, Filter, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { ProfileSelect } from '@/features/Profile/components/ProfileSelect';
import { EventStatus } from '@/shared/types/events';
import { useEventMainTypes } from '../hooks/useEventMainTypes';
import { useEventSubTypes, EventSubType } from '../hooks/useEventSubTypes';
import { cn } from '@/shared/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface EventFilterProps {
  onFilterChange: (filters: EventFilters) => void;
}

export interface EventFilters {
  search: string;
  status: EventStatus | 'all';
  user_id: string;
  main_type_id: string;
  sub_type_id: string;
}

export const EventFilter = ({ onFilterChange }: EventFilterProps) => {
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState<EventFilters>({
    search: '',
    status: 'all',
    user_id: 'all',
    main_type_id: 'all',
    sub_type_id: 'all',
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const { data: mainTypes = [], isLoading: isLoadingMainTypes } = useEventMainTypes();
  const { data: subTypes = [], isLoading: isLoadingSubTypes } = useEventSubTypes(
    filters.main_type_id !== 'all' ? filters.main_type_id : undefined
  );

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
      setFilters(prev => ({ ...prev, search: value }));
      onFilterChange({ ...filters, search: value });
      setIsSearching(false);
    }, 1000);
  }, [filters, onFilterChange]);

  const handleFilterChange = (key: keyof EventFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    if (key === 'main_type_id') {
      newFilters.sub_type_id = 'all';
    }
    setFilters(newFilters);
    onFilterChange(newFilters);
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
              placeholder="ค้นหาชื่อบริษัท, รายละเอียด..."
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
            {/* Filter Controls */}
            <div className="flex flex-row flex-wrap gap-4">
              {/* Company Filter */}
              <motion.div 
                className="flex flex-col gap-2"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <label className="text-sm font-medium"> เซลล์</label>
                <ProfileSelect
                  value={filters.user_id}
                  onValueChange={(value) => handleFilterChange('user_id', value)}
                  placeholder="เลือกเซลล์"
                />
              </motion.div>

              {/* Status Filter */}
              <motion.div 
                className="flex flex-col gap-2"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <label className="text-sm font-medium">สถานะ</label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => handleFilterChange('status', value)}
                >
                  <SelectTrigger>
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
                className="flex flex-col gap-2"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <label className="text-sm font-medium">ประเภทหลัก</label>
                <Select
                  value={filters.main_type_id}
                  onValueChange={(value) => handleFilterChange('main_type_id', value)}
                  disabled={isLoadingMainTypes}
                >
                  <SelectTrigger>
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
                className="flex flex-col gap-2"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <label className="text-sm font-medium">ประเภทย่อย</label>
                <Select
                  value={filters.sub_type_id}
                  onValueChange={(value) => handleFilterChange('sub_type_id', value)}
                  disabled={isLoadingSubTypes || filters.main_type_id === 'all'}
                >
                  <SelectTrigger>
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
            </div>

            {/* Reset Filters Button */}
            <motion.div 
              className="flex justify-end mt-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                variant="outline"
                onClick={() => {
                  setFilters({
                    search: '',
                    status: 'all',
                    user_id: 'all',
                    main_type_id: 'all',
                    sub_type_id: 'all',
                  });
                  onFilterChange({
                    search: '',
                    status: 'all',
                    user_id: 'all',
                    main_type_id: 'all',
                    sub_type_id: 'all',
                  });
                }}
                className="w-full sm:w-auto"
              >
                <Filter className="mr-2 h-4 w-4" />
                รีเซ็ตตัวกรอง
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
