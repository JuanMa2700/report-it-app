import { Link } from 'react-router'
import { Button } from '@/components/ui/button'

export function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Acceso no autorizado</h1>
      <p className="text-muted-foreground">No tienes permisos para acceder a esta página.</p>
      <Button asChild>
        <Link to="/dashboard">Volver al dashboard</Link>
      </Button>
    </div>
  )
}
