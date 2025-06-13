import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { useState } from "react";

interface DeleteEventModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => Promise<void>;
}

export function DeleteEventModal({
  isOpen,
  onOpenChange,
  onDelete,
}: DeleteEventModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete();
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting event:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => {
      if (!open && !isDeleting) {
        onOpenChange(false);
      }
    }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>ยืนยันการลบกิจกรรม</AlertDialogTitle>
          <AlertDialogDescription>
            คุณต้องการลบกิจกรรมนี้ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>ยกเลิก</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {isDeleting ? "กำลังลบ..." : "ลบ"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 