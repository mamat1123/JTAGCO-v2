// src/app/provider.tsx
import { StrictMode } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/app/router';
import { ThemeProvider } from '@/contexts/ThemeContext';

export function AppProvider() {
  return (
    <StrictMode>
      <ThemeProvider defaultTheme="system" storageKey="jtagco-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
    </StrictMode>
  );
}