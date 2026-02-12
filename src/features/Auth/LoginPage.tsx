// src/features/auth/components/login-form.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/shared/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/shared/components/ui/dialog';
import { useLogin } from '@/features/Auth/hooks';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useLogin();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showUnapprovedDialog, setShowUnapprovedDialog] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login({ username, password });
      navigate('/dashboard');
    } catch (err: unknown) {
      console.log(err);
      const axiosErr = err as { response?: { data?: { message?: string } } };
      if (axiosErr.response?.data?.message === 'Your account is not approved yet') {
        setShowUnapprovedDialog(true);
      } else {
        setError('Invalid username or password');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex justify-center items-center h-screen p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle className="text-2xl">เข้าสู่ระบบ</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm bg-red-100 text-red-600 rounded-md">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="username">ชื่อผู้ใช้</Label>
              <Input
                id="username"
                value={username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                placeholder="กรอกชื่อผู้ใช้"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">รหัสผ่าน</Label>
                <a className="text-sm text-primary hover:underline" href="/forgot-password">
                  ลืมรหัสผ่าน?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            ยังไม่มีบัญชี?{' '}
            <a href="/register" className="text-primary hover:underline">
              สมัครสมาชิก
            </a>
          </p>
        </CardFooter>
      </Card>

      <Dialog open={showUnapprovedDialog} onOpenChange={setShowUnapprovedDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>บัญชียังไม่ได้รับการอนุมัติ</DialogTitle>
            <DialogDescription>
              บัญชีของคุณยังอยู่ระหว่างการตรวจสอบ กรุณารอการอนุมัติจากผู้ดูแลระบบ
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowUnapprovedDialog(false)}>
              ตกลง
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}