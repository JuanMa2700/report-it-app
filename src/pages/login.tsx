import { useState, type FormEvent } from "react";
import { Navigate } from "react-router";
import { useAuth } from "@/contexts/auth-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Shield, MapPin, Bell } from "lucide-react";

export function LoginPage() {
  const { login, token, isLoading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (authLoading) return null;
  if (token) return <Navigate to="/dashboard" replace />;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await login(email, password);
    } catch {
      setError("Credenciales inválidas");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left — Hero */}
      <div className="relative hidden w-[55%] overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-violet-800 lg:flex lg:flex-col lg:justify-between">
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-1 flex-col justify-center px-12 xl:px-20">
          <img
            src="/logo.png"
            alt="YoReporto"
            className="mb-8 h-14 self-start brightness-0 invert"
          />
          <h1 className="mb-4 text-4xl font-bold leading-tight text-white xl:text-5xl">
            Monitorea tu comunidad en tiempo real
          </h1>
          <p className="mb-10 max-w-md text-lg text-violet-200">
            Gestiona reportes de incidentes, coordina respuestas y mantén la
            seguridad de tu comunidad.
          </p>

          {/* Feature cards */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 rounded-xl bg-white/10 px-5 py-4 backdrop-blur-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/20">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Mapa en vivo</p>
                <p className="text-sm text-violet-200">
                  Visualiza incidentes geolocalizados al instante
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-xl bg-white/10 px-5 py-4 backdrop-blur-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/20">
                <Bell className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  Alertas prioritarias
                </p>
                <p className="text-sm text-violet-200">
                  Los casos críticos aparecen primero
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-xl bg-white/10 px-5 py-4 backdrop-blur-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/20">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  Gestión integral
                </p>
                <p className="text-sm text-violet-200">
                  Asigna, resuelve y documenta cada incidente
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom accent */}
        <div className="relative z-10 px-12 pb-8 xl:px-20">
          <p className="text-xs text-violet-300">
            &copy; {new Date().getFullYear()} YoReporto. Seguridad para tu
            comunidad.
          </p>
        </div>
      </div>

      {/* Right — Login form */}
      <div className="flex w-full flex-col lg:w-[45%]">
        <div className="h-[3px] shrink-0 bg-gradient-to-r from-violet-500 via-purple-500 to-violet-600 lg:hidden" />
        <div className="flex flex-1 flex-col items-center justify-center px-5 sm:px-12">
          <div className="w-full max-w-sm">
            <div className="mb-6 text-center sm:mb-8">
              <img
                src="/logo.png"
                alt="YoReporto"
                className="mx-auto mb-3 h-10 sm:mb-4 sm:h-12 lg:h-14"
              />
              <h2 className="text-lg font-semibold sm:text-xl">Bienvenido de vuelta</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Ingresa al panel de vigilancia
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button
                type="submit"
                className="h-11 w-full cursor-pointer text-sm"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Ingresando..." : "Ingresar"}
              </Button>
            </form>

            <p className="mt-8 text-center text-xs text-muted-foreground lg:hidden">
              &copy; {new Date().getFullYear()} YoReporto. Seguridad para tu
              comunidad.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
