import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom'
import App from './app'
import { LoginPage } from './routes/login'
import { HomePage } from './routes/home'
import { AboutPage } from './routes/about'
import { ContactPage } from './routes/contact'
import { RegisterPage } from './routes/register'
import { NotFoundPage } from './routes/not-found'
import { ROUTES } from '@/config/constants'
import { AuthLayout } from '@/components/layout/auth-layout'
import { MainLayout } from '@/components/layout/main-layout'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { ReactNode } from 'react'

// Protected route component
function ProtectedRoute({ children }: { children: ReactNode }) {
  const auth = localStorage.getItem('auth_token')
  return auth ? <>{children}</> : <Navigate to="/login" />
}

// Auth route component (redirects to home if already logged in)
function AuthRoute({ children }: { children: ReactNode }) {
  const auth = localStorage.getItem('auth_token')
  return auth ? <Navigate to="/dashboard" /> : <>{children}</>
}

// Define routes
const routes: RouteObject[] = [
  // Auth routes (no sidebar, navbar, or footer)
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        index: true, // Default route is login
        element: (
          <AuthRoute>
            <LoginPage />
          </AuthRoute>
        ),
      },
      {
        path: '/register',
        element: (
          <AuthRoute>
            <RegisterPage />
          </AuthRoute>
        ),
      },
    ]
  },
  
  // Dashboard routes (with sidebar)
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/dashboard',
        element: <HomePage />,
      },
      {
        path: '/profile',
        element: <div>User Profile</div>,
      },
      {
        path: '/analytics',
        element: <div>Analytics Dashboard</div>,
      },
      {
        path: '/billing',
        element: <div>Billing Information</div>,
      },
      {
        path: '/settings',
        element: <div>Account Settings</div>,
      },
      {
        path: '/help',
        element: <div>Help & Support</div>,
      },
    ],
  },
  
  // Main layout routes (with navbar and footer but no sidebar)
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: ROUTES.ABOUT,
        element: <AboutPage />,
      },
      {
        path: ROUTES.CONTACT,
        element: <ContactPage />,
      },
    ],
  },
  
  // 404 page
  {
    path: '*',
    element: <NotFoundPage />,
  },
]

export const router = createBrowserRouter(routes)