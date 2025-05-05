import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const customerFormSchema = z.object({
  contact_name: z.string().min(1, "กรุณากรอกชื่อ"),
  position: z.string().min(1, "กรุณากรอกตำแหน่ง"),
  email: z.string().email("กรุณากรอกอีเมลให้ถูกต้อง").optional().or(z.literal("")),
  phone: z.string()
    .min(1, "กรุณากรอกเบอร์โทรศัพท์")
    .regex(/^[0-9+\-\s()]*$/, "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง"),
  line_id: z.string().optional().or(z.literal("")),
});

type CustomerFormValues = z.infer<typeof customerFormSchema>;

interface CustomerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CustomerFormValues) => Promise<void>;
  initialData?: CustomerFormValues;
  mode?: 'add' | 'edit';
}

export function CustomerForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode = 'add'
}: CustomerFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      contact_name: "",
      position: "",
      email: "",
      phone: "",
      line_id: "",
    },
  });

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    } else {
      form.reset({
        contact_name: "",
        position: "",
        email: "",
        phone: "",
        line_id: "",
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (data: CustomerFormValues) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      form.reset();
      onClose();
      toast.success(mode === 'add' ? "เพิ่มข้อมูลผู้ติดต่อสำเร็จ" : "แก้ไขข้อมูลผู้ติดต่อสำเร็จ");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(mode === 'add' ? "ไม่สามารถเพิ่มข้อมูลผู้ติดต่อได้" : "ไม่สามารถแก้ไขข้อมูลผู้ติดต่อได้");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      form.reset();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {mode === 'edit' ? "แก้ไขผู้ติดต่อ" : "เพิ่มผู้ติดต่อ"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="contact_name"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>ชื่อ-นามสกุล</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="กรอกชื่อ-นามสกุล"
                        {...field}
                        disabled={isSubmitting}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>ตำแหน่ง</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="กรอกตำแหน่ง"
                        {...field}
                        disabled={isSubmitting}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>อีเมล</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="กรอกอีเมล"
                        type="email"
                        {...field}
                        disabled={isSubmitting}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>เบอร์โทรศัพท์</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="กรอกเบอร์โทรศัพท์"
                        type="tel"
                        {...field}
                        disabled={isSubmitting}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="line_id"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Line ID</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="กรอก Line ID"
                        {...field}
                        disabled={isSubmitting}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
                className="min-w-[100px]"
              >
                ยกเลิก
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[100px]"
              >
                {isSubmitting ? "กำลังบันทึก..." : mode === 'edit' ? "บันทึก" : "เพิ่ม"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 