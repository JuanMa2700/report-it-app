import { Navigate } from 'react-router'
import { useAuth } from '@/contexts/auth-context'
import type { Role } from '@/lib/types'
import type { ReactNode } from 'react'

interface RoleGuardProps {
  allowedRoles: Role[]
  children: ReactNode
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { user } = useAuth()

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <>{children}</>
}
