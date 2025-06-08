import { Navigate } from 'react-router-dom';
import { useProfile } from '@/features/Profile/hooks/useProfile';
import { UserRole } from "@/shared/types/roles";

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { profile } = useProfile();
  const isAdmin = profile?.role === UserRole.ADMIN || profile?.role === UserRole.SUPER_ADMIN;

  if (!isAdmin) {
    return <Navigate to="/settings" replace />;
  }

  return <>{children}</>;
} 