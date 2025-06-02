import { useState, useEffect } from 'react';
import { profileAPI } from '@/entities/Profile/profileAPI';
import { Profile } from '@/entities/Profile/profile';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Pencil } from "lucide-react";

export const ApproveUserPage = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const allProfiles = await profileAPI.getProfile();
      setProfiles(allProfiles);
    } catch (error) {
      toast.error('ไม่สามารถดึงข้อมูลผู้ใช้ได้');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (profileId: string, status: 'approved' | 'rejected') => {
    try {
      await profileAPI.approveProfile({ profileId, status });
      toast.success(`ดำเนินการ${status === 'approved' ? 'อนุมัติ' : 'ปฏิเสธ'}เรียบร้อยแล้ว`);
      fetchProfiles();
      setIsActionModalOpen(false);
      setSelectedProfile(null);
    } catch (error) {
      toast.error(`ไม่สามารถ${status === 'approved' ? 'อนุมัติ' : 'ปฏิเสธ'}ได้`);
    }
  };

  const pendingProfiles = profiles.filter(profile => profile.status === 'wait_for_approve');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">จัดการผู้ใช้งาน</h1>
        <Badge variant="outline" className="text-sm">
          รอการอนุมัติ ({pendingProfiles.length})
        </Badge>
      </div>
      
      {pendingProfiles.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          ไม่มีผู้ใช้ที่รอการอนุมัติ
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ชื่อ-นามสกุล</TableHead>
                <TableHead>อีเมล</TableHead>
                <TableHead>บทบาท</TableHead>
                <TableHead>เบอร์โทรศัพท์</TableHead>
                <TableHead className="text-right">ดำเนินการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingProfiles.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell className="font-medium">{profile.fullname}</TableCell>
                  <TableCell>{profile.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{profile.role}</Badge>
                  </TableCell>
                  <TableCell>{profile.phone}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedProfile(profile);
                        setIsActionModalOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Action Confirmation Modal */}
      <Dialog open={isActionModalOpen} onOpenChange={setIsActionModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ตรวจสอบและดำเนินการ</DialogTitle>
            <DialogDescription>
              กรุณาตรวจสอบข้อมูลและเลือกดำเนินการ
            </DialogDescription>
          </DialogHeader>
          {selectedProfile && (
            <div className="space-y-2 py-4">
              <p><span className="font-medium">ชื่อ-นามสกุล:</span> {selectedProfile.fullname}</p>
              <p><span className="font-medium">อีเมล:</span> {selectedProfile.email}</p>
              <p><span className="font-medium">บทบาท:</span> {selectedProfile.role}</p>
              <p><span className="font-medium">เบอร์โทรศัพท์:</span> {selectedProfile.phone}</p>
            </div>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsActionModalOpen(false);
                setSelectedProfile(null);
              }}
              className="w-full sm:w-auto"
            >
              ยกเลิก
            </Button>
            <Button
              onClick={() => selectedProfile && handleApprove(selectedProfile.id, 'rejected')}
              variant="destructive"
              className="w-full sm:w-auto"
            >
              ปฏิเสธ
            </Button>
            <Button
              onClick={() => selectedProfile && handleApprove(selectedProfile.id, 'approved')}
              className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
            >
              อนุมัติ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};