import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  MapPin,
  Bell,
  Shield,
  BarChart3,
  Users,
  Zap,
  ArrowRight,
  CheckCircle2,
  Smartphone,
  LayoutDashboard,
} from "lucide-react";

export function LandingPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    organization: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(
      `Solicitud de demo — ${form.organization || form.name}`
    );
    const body = encodeURIComponent(
      `Nombre: ${form.name}\nEmail: ${form.email}\nOrganización: ${form.organization}\n\nMensaje:\n${form.message}`
    );
    window.location.href = `mailto:dianapradavanegas@gmail.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <a href="#top" className="flex items-center gap-2">
            <img src="/logo.png" alt="YoReporto" className="h-9 w-auto" />
          </a>
          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Funcionalidades
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Cómo funciona
            </a>
            <a
              href="#demo"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Solicitar demo
            </a>
          </nav>
          <Button asChild size="sm">
            <a href="#demo">Solicitar demo</a>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section
        id="top"
        className="relative scroll-mt-20 overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-violet-800"
      >
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="hero-grid"
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
            <rect width="100%" height="100%" fill="url(#hero-grid)" />
          </svg>
        </div>
        {/* Glow blobs */}
        <div className="pointer-events-none absolute -top-20 -left-20 h-80 w-80 rounded-full bg-violet-400/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-purple-400/20 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:py-28">
          <div className="flex flex-col justify-center">
            <span className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              Plataforma de seguridad comunitaria
            </span>
            <h1 className="mb-5 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Monitorea tu comunidad{" "}
              <span className="bg-gradient-to-r from-violet-200 to-white bg-clip-text text-transparent">
                en tiempo real
              </span>
            </h1>
            <p className="mb-8 max-w-lg text-lg text-violet-100">
              YoReporto centraliza los reportes de incidentes, coordina respuestas
              y te da visibilidad total sobre la seguridad de tu comunidad desde
              un solo panel.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-12 bg-white px-7 text-base font-semibold text-violet-700 hover:bg-violet-50"
              >
                <a href="#demo">
                  Solicitar una demo
                  <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 border-white/30 bg-white/10 px-7 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
              >
                <a href="#features">Ver funcionalidades</a>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-violet-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                Reportes geolocalizados
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                Alertas prioritarias
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                Métricas en vivo
              </div>
            </div>
          </div>

          {/* Product mockup */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute -inset-4 rounded-3xl bg-white/10 blur-2xl" />
              <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/95 shadow-2xl backdrop-blur">
                {/* Fake window chrome */}
                <div className="flex items-center gap-1.5 border-b border-slate-200 bg-slate-50 px-4 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  <span className="ml-3 text-xs font-medium text-slate-500">
                    panel.yoreporto.com
                  </span>
                </div>
                {/* Fake dashboard */}
                <div className="bg-slate-50 p-4">
                  {/* Stat cards */}
                  <div className="mb-4 grid grid-cols-3 gap-2">
                    {[
                      { label: "Activos", value: "24", color: "bg-violet-500" },
                      { label: "Urgentes", value: "6", color: "bg-red-500" },
                      {
                        label: "Resueltos",
                        value: "182",
                        color: "bg-emerald-500",
                      },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className="rounded-lg border border-slate-200 bg-white p-3"
                      >
                        <div
                          className={`mb-2 h-1 w-8 rounded-full ${s.color}`}
                        />
                        <div className="text-lg font-bold text-slate-900">
                          {s.value}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {s.label}
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Fake map */}
                  <div className="relative h-40 overflow-hidden rounded-lg border border-slate-200 bg-gradient-to-br from-violet-100 via-slate-100 to-violet-50">
                    <div className="absolute inset-0 opacity-30">
                      <svg
                        className="h-full w-full"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <defs>
                          <pattern
                            id="map-grid"
                            width="20"
                            height="20"
                            patternUnits="userSpaceOnUse"
                          >
                            <path
                              d="M 20 0 L 0 0 0 20"
                              fill="none"
                              stroke="#a78bfa"
                              strokeWidth="0.5"
                            />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#map-grid)" />
                      </svg>
                    </div>
                    {[
                      { top: "20%", left: "25%", color: "bg-red-500" },
                      { top: "55%", left: "60%", color: "bg-violet-500" },
                      { top: "35%", left: "75%", color: "bg-amber-500" },
                      { top: "70%", left: "30%", color: "bg-emerald-500" },
                    ].map((m, i) => (
                      <div
                        key={i}
                        className="absolute"
                        style={{ top: m.top, left: m.left }}
                      >
                        <span className={`absolute inset-0 animate-ping rounded-full ${m.color} opacity-50`} />
                        <span
                          className={`relative block h-3 w-3 rounded-full ${m.color} ring-2 ring-white`}
                        />
                      </div>
                    ))}
                  </div>
                  {/* Fake list */}
                  <div className="mt-3 space-y-2">
                    {[
                      { cat: "Robo", prio: "Alta", color: "bg-red-500" },
                      { cat: "Vandalismo", prio: "Media", color: "bg-amber-500" },
                    ].map((r, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-2"
                      >
                        <span className={`h-2 w-2 rounded-full ${r.color}`} />
                        <span className="text-xs font-medium text-slate-700">
                          {r.cat}
                        </span>
                        <span className="ml-auto text-[10px] text-slate-500">
                          {r.prio}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="mb-3 inline-block rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
            Funcionalidades
          </span>
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Todo lo que necesitas para proteger tu comunidad
          </h2>
          <p className="text-muted-foreground">
            Herramientas diseñadas para vigilantes, administradores y equipos de
            seguridad que necesitan actuar rápido.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: MapPin,
              title: "Mapa en vivo",
              desc: "Visualiza todos los incidentes geolocalizados en un mapa interactivo, con marcadores diferenciados por categoría y urgencia.",
            },
            {
              icon: Bell,
              title: "Alertas prioritarias",
              desc: "Los reportes críticos se muestran primero. Notificaciones en tiempo real para que ningún incidente pase desapercibido.",
            },
            {
              icon: Shield,
              title: "Gestión integral",
              desc: "Asigna, da seguimiento, resuelve y documenta cada reporte con un historial completo de acciones y responsables.",
            },
            {
              icon: BarChart3,
              title: "Analítica avanzada",
              desc: "Métricas por categoría, estado, urgencia y tendencias en el tiempo para tomar decisiones basadas en datos.",
            },
            {
              icon: Smartphone,
              title: "Reportes móviles",
              desc: "La comunidad reporta desde su celular con fotos, video y ubicación exacta. Los vigilantes responden desde el panel.",
            },
            {
              icon: Users,
              title: "Roles y permisos",
              desc: "Separa funciones entre vigilantes y administradores. Control granular sobre quién ve y gestiona qué información.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="group relative rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-md shadow-violet-500/20">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-20 border-y border-border bg-accent/30 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <span className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              Cómo funciona
            </span>
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Tres pasos para tener control total
            </h2>
            <p className="text-muted-foreground">
              Desde el reporte ciudadano hasta la resolución documentada, todo
              fluye por una sola plataforma.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Smartphone,
                step: "01",
                title: "La comunidad reporta",
                desc: "Los ciudadanos envían incidentes desde la app móvil con fotos, descripción y ubicación GPS.",
              },
              {
                icon: Zap,
                step: "02",
                title: "El equipo se activa",
                desc: "Los vigilantes reciben alertas inmediatas priorizadas por urgencia y las atienden desde el panel.",
              },
              {
                icon: LayoutDashboard,
                step: "03",
                title: "Se mide el impacto",
                desc: "Los administradores acceden a métricas y analítica para optimizar la operación continuamente.",
              },
            ].map((s, i, arr) => (
              <div key={s.step} className="relative">
                {i < arr.length - 1 && (
                  <div className="absolute top-8 left-full hidden h-px w-full -translate-x-4 bg-gradient-to-r from-primary/40 to-transparent md:block" />
                )}
                <div className="flex flex-col items-start">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 text-white shadow-lg shadow-violet-500/30">
                      <s.icon className="h-7 w-7" />
                    </div>
                    <span className="text-5xl font-bold text-primary/20">
                      {s.step}
                    </span>
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">{s.title}</h3>
                  <p className="text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo CTA */}
      <section id="demo" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20 sm:px-8 lg:py-28">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-violet-800 p-8 shadow-xl sm:p-12 lg:p-16">
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-10">
            <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern
                  id="cta-grid"
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
              <rect width="100%" height="100%" fill="url(#cta-grid)" />
            </svg>
          </div>
          <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-violet-400/30 blur-3xl" />

          <div className="relative grid gap-10 lg:grid-cols-2">
            <div className="flex flex-col justify-center text-white">
              <h2 className="mb-4 text-3xl font-bold leading-tight sm:text-4xl">
                Agenda una demo personalizada
              </h2>
              <p className="mb-8 max-w-md text-lg text-violet-100">
                Cuéntanos sobre tu comunidad u organización y te mostraremos cómo
                YoReporto se adapta a tus necesidades. Sin compromiso.
              </p>
              <ul className="space-y-3">
                {[
                  "Demo en vivo del panel completo",
                  "Configuración sugerida para tu caso",
                  "Respuesta en menos de 24 horas",
                ].map((i) => (
                  <li key={i} className="flex items-center gap-3 text-violet-100">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-300" />
                    {i}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
              {submitted ? (
                <div className="flex h-full min-h-[320px] flex-col items-center justify-center text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                    <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">¡Gracias!</h3>
                  <p className="text-muted-foreground">
                    Se abrió tu cliente de correo con la solicitud. Te responderemos
                    muy pronto.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-6"
                    onClick={() => setSubmitted(false)}
                  >
                    Enviar otra solicitud
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-xl font-semibold text-slate-900">
                    Solicita tu demo
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre</Label>
                      <Input
                        id="name"
                        required
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        placeholder="Tu nombre"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        placeholder="correo@ejemplo.com"
                        className="h-11"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organization">Organización</Label>
                    <Input
                      id="organization"
                      value={form.organization}
                      onChange={(e) =>
                        setForm({ ...form, organization: e.target.value })
                      }
                      placeholder="Nombre del conjunto, empresa o entidad"
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">¿Cuéntanos sobre tu caso?</Label>
                    <textarea
                      id="message"
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                      rows={4}
                      placeholder="¿Cuántos usuarios tendrías? ¿Qué necesitas resolver?"
                      className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <Button type="submit" size="lg" className="h-12 w-full text-base">
                    Solicitar demo
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    Al enviar aceptas que te contactemos por email.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 sm:px-8 md:flex-row">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="YoReporto" className="h-8 w-auto" />
          </div>
          <p className="text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} YoReporto. Seguridad para tu
            comunidad.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <a href="#features" className="hover:text-foreground">
              Funcionalidades
            </a>
            <a href="#demo" className="hover:text-foreground">
              Demo
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
