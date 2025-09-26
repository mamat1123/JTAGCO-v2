"use client"

import { useState } from "react"
import { Button } from "@/shared/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { toast } from "sonner"
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
  const [selectedProfile, setSelectedProfile] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const handleTransfer = async () => {
    if (!selectedProfile || selectedProfile === "") return

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
              <Select 
                value={selectedProfile} 
                onValueChange={(value) => setSelectedProfile(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="เลือกผู้ใช้..." />
                </SelectTrigger>
                <SelectContent className="max-h-[250px] sm:max-h-[300px]">
                  {profiles
                    .filter(profile => profile.id !== company.user_id)
                    .map((profile) => (
                    <SelectItem key={profile.id} value={profile.id}>
                      <div className="flex flex-col">
                        <span>{profile.fullname}</span>
                        <span className="text-xs text-muted-foreground">{profile.email}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              disabled={!selectedProfile || selectedProfile === "" || isLoading} 
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