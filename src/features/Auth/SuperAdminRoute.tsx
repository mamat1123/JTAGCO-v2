import { Navigate } from 'react-router-dom';
import { useProfile } from '@/features/Profile/hooks/useProfile';
import { UserRole } from "@/shared/types/roles";

export function SuperAdminRoute({ children }: { children: React.ReactNode }) {
  const { profile } = useProfile();
  const isSuperAdmin = profile?.role === UserRole.SUPER_ADMIN;

  if (!isSuperAdmin) {
    return <Navigate to="/settings" replace />;
  }

  return <>{children}</>;
} 