import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Badge } from "@/shared/components/ui/badge";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/shared/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { Product } from '@/entities/Product/product';

interface InsoleSelectorProps {
  selectedInsoles: string[];
  insoleProducts: Product[];
  onInsoleSelect: (insoleId: string) => void;
}

export function InsoleSelector({
  selectedInsoles,
  insoleProducts,
  onInsoleSelect,
}: InsoleSelectorProps) {
  const [openInsolePopover, setOpenInsolePopover] = useState(false);

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {selectedInsoles.map((insoleId) => {
            const insole = insoleProducts.find(p => p.id === insoleId);
            return insole ? (
              <Badge
                key={insoleId}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {insole.name}
                <button
                  type="button"
                  onClick={() => onInsoleSelect(insoleId)}
                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove {insole.name}</span>
                </button>
              </Badge>
            ) : null;
          })}
        </div>

        <Popover open={openInsolePopover} onOpenChange={setOpenInsolePopover}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openInsolePopover}
              className="w-full justify-between"
            >
              เลือกแผ่นรองในรองเท้า
              <Plus className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="ค้นหาแผ่นรองในรองเท้า..." />
              <CommandEmpty>ไม่พบแผ่นรองในรองเท้าที่ต้องการ</CommandEmpty>
              <CommandGroup>
                {insoleProducts.map((insole) => (
                  <CommandItem
                    key={insole.id}
                    onSelect={() => {
                      onInsoleSelect(insole.id);
                      setOpenInsolePopover(false);
                    }}
                  >
                    {insole.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
} 