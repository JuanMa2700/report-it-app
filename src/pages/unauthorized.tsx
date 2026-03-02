import { useNavigate } from 'react-router'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { LogIn, LogOut } from 'lucide-react'

export function UnauthorizedPage() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  function handleLoginWithOtherAccount() {
    logout()
    navigate('/login')
  }

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
      <h1 className="text-2xl font-bold">Acceso no autorizado</h1>
      <p className="text-center text-muted-foreground">
        No tienes permisos para acceder a esta página.
      </p>
      <div className="flex flex-col items-center gap-2">
        <Button className="cursor-pointer" onClick={handleLoginWithOtherAccount}>
          <LogIn className="mr-2 h-4 w-4" />
          Iniciar sesión con otra cuenta
        </Button>
        <Button variant="ghost" className="cursor-pointer text-muted-foreground" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar sesión
        </Button>
      </div>
    </div>
  )
}
