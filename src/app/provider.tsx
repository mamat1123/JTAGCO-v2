// src/app/provider.tsx
import { StrictMode } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/features/auth/hooks/use-auth';

export function AppProvider() {
  return (
    <StrictMode>
      <ThemeProvider defaultTheme="system" storageKey="jtagco-theme">
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ThemeProvider>
    </StrictMode>
  );
}