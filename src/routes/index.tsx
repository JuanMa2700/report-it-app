import { createBrowserRouter, Navigate, RouterProvider } from 'react-router'
import { ProtectedRoute } from './protected-route'
import { RoleGuard } from './role-guard'
import { AppLayout } from '@/components/layout/app-layout'
import { LoginPage } from '@/pages/login'
import { UnauthorizedPage } from '@/pages/unauthorized'
import { DashboardPage } from '@/pages/dashboard'
import { AnalyticsPage } from '@/pages/analytics'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/unauthorized',
    element: <UnauthorizedPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: (
          <RoleGuard allowedRoles={['VIGILANT', 'ADMIN']}>
            <AppLayout />
          </RoleGuard>
        ),
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          { path: 'dashboard', element: <DashboardPage /> },
          {
            path: 'analytics',
            element: (
              <RoleGuard allowedRoles={['ADMIN']}>
                <AnalyticsPage />
              </RoleGuard>
            ),
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])

export function Routes() {
  return <RouterProvider router={router} />
}
