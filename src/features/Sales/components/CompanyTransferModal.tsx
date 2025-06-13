"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/shared/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog"
import { CompanyDto } from "@/entities/Company/company"
import { Profiles } from "@/entities/Profile/profile"
import { CompaniesService } from "@/features/Sales/services/CompaniesService"

interface CompanyTransferModalProps {
  company: CompanyDto
  profiles: Profiles
  onSuccess?: () => void,
  open: boolean,
  onOpenChange: (open: boolean) => void,
  onClose: () => void
}

export function CompanyTransferModal({ 
  company, 
  profiles,
  onSuccess,
  open,
  onOpenChange,
  onClose
}: CompanyTransferModalProps) {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [popoverOpen, setPopoverOpen] = useState(false)

  const handleTransfer = async () => {
    if (!selectedProfile) return

    setIsLoading(true)
    try {
      await CompaniesService.transferCompany(company.id, selectedProfile)

      toast.success("โอนบริษัทสำเร็จ", {
        description: `บริษัท ${company.name} ถูกโอนให้ ${profiles.find((profile) => profile.id === selectedProfile)?.fullname} แล้ว`
      })
      
      // Call success callback
      onSuccess?.()
    } catch (error) {
      console.error('Error transferring company:', error)
      toast.error("เกิดข้อผิดพลาดในการโอนบริษัท")
    } finally {
      setIsLoading(false)
      window.location.reload()
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] md:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>โอนบริษัท</DialogTitle>
            <DialogDescription>โอนบริษัทนี้ให้ผู้ใช้อื่น</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">ข้อมูลบริษัท</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">ชื่อบริษัท</p>
                  <p className="font-medium">{company.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">สาขา</p>
                  <p className="font-medium">{company.branch || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">อีเมล</p>
                  <p className="font-medium">{company.email || '-'}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">โอนให้</h3>
              <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    role="combobox" 
                    aria-expanded={popoverOpen} 
                    className="w-full justify-between"
                  >
                    {selectedProfile 
                      ? profiles.find((profile) => profile.id === selectedProfile)?.fullname 
                      : "เลือกผู้ใช้..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  <Command>
                    <CommandInput placeholder="ค้นหาผู้ใช้..." />
                    <CommandList>
                      <CommandEmpty>ไม่พบผู้ใช้</CommandEmpty>
                      <CommandGroup>
                        {profiles
                          .filter(profile => profile.id !== company.user_id)
                          .map((profile) => (
                          <CommandItem
                            key={profile.id}
                            onSelect={() => {
                              setSelectedProfile(profile.id)
                              setPopoverOpen(false)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedProfile === profile.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <div className="flex flex-col">
                              <span>{profile.fullname}</span>
                              <span className="text-xs text-muted-foreground">{profile.email}</span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => onClose()}
              disabled={isLoading}
            >
              ยกเลิก
            </Button>
            <Button 
              disabled={!selectedProfile || isLoading} 
              onClick={() => setConfirmDialogOpen(true)}
            >
              โอนบริษัท
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการโอน</AlertDialogTitle>
            <AlertDialogDescription>
              คุณต้องการโอนบริษัท {company.name} ให้{" "}
              {profiles.find((profile) => profile.id === selectedProfile)?.fullname} ใช่หรือไม่?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleTransfer}
              disabled={isLoading}
            >
              {isLoading ? "กำลังโอน..." : "ยืนยันการโอน"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
} 