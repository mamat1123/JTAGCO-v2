"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/shared/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover"
import { CompaniesService } from "@/features/Sales/services/CompaniesService"
import { Company } from "@/entities/Company/company"
import { useNavigate } from "react-router-dom"

export function DashboardSearchSelection() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [companies, setCompanies] = useState<Company[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const searchCompanies = async () => {
      if (searchQuery.length < 2) {
        setCompanies([])
        return
      }

      try {
        setIsLoading(true)
        const results = await CompaniesService.searchCompanies(searchQuery)
        setCompanies(results)
      } catch (error) {
        console.error('Error searching companies:', error)
        setCompanies([])
      } finally {
        setIsLoading(false)
      }
    }

    const debounceTimer = setTimeout(searchCompanies, 1000)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? companies.find((company) => company.id === value)?.name
            : "ค้นหาบริษัท..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder="ค้นหาบริษัท..."
            className="h-9"
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="ml-2 text-sm text-muted-foreground">กำลังค้นหา...</span>
              </div>
            ) : (
              <>
                <CommandEmpty>ไม่พบบริษัท</CommandEmpty>
                <CommandGroup>
                  {companies.map((company) => (
                    <CommandItem
                      key={company.id}
                      value={`${company.id}|${company.name}`}
                      onSelect={(currentValue) => {
                        const [selectedId] = currentValue.split('|')
                        setValue(selectedId)
                        setOpen(false)
                        navigate(`/companies/${selectedId}`)
                      }}
                    >
                      <div className="flex flex-col">
                        <span>{company.name}</span>
                        <span className="text-xs text-muted-foreground">ID: {company.id}</span>
                      </div>
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          value === company.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
