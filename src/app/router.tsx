import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoginPage from '@/features/Auth/LoginPage';
import RegisterPage from '@/features/Auth/RegisterPage';
import { ProtectedRoute } from '@/features/Auth/ProtectedRoute';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import DashboardPage from '@/features/Dashboard/DashboardPage';
import { SaleDashboardPage } from '@/features/Sales/SalesPage';
import { CompanyDetails } from "@/features/Sales/pages/CompanyDetailsPage";
import { EditCompany } from '@/features/Sales/pages/EditCompanyPage';
import { CreateCompanyPage } from "@/features/Sales/pages/CreateCompanyPage";
import ProductsPage from '@/features/Settings/Products/ProductsPage';
import SettingsPage from '@/features/Settings/SettingsPage';
import EventsPage from '@/features/Events/pages/EventsPage';
import { CreateEventPage } from '@/features/Events/pages/CreateEventPage';
import { ApproveUserPage } from '@/features/Settings/Users/ApproveUserPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
      {
        path: '/sales',
        element: <SaleDashboardPage />,
      },
      {
        path: "/companies",
        element: <Navigate to="/sales?tab=customers" replace />,
      },
      {
        path: "/companies/create",
        element: <CreateCompanyPage />,
      },
      {
        path: "/companies/:id",
        element: <CompanyDetails />,
      },
      {
        path: '/companies/:id/edit',
        element: <EditCompany />
      },
      {
        path: '/billing',
        element: <div>Billing Information</div>,
      },
      {
        path: '/help',
        element: <div>Help & Support</div>,
      },
      {
        path: '/events',
        element: <EventsPage />,
      },
      {
        path: "/companies/:companyId/events/create",
        element: <CreateEventPage />,
      },
    ],
  },
  {
    path: '/settings',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <SettingsPage />,
      },
      {
        path: 'products',
        element: <ProductsPage />,
      },
      {
        path: 'users',
        element: <ApproveUserPage />,
      },
    ],
  }
]);
