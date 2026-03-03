import { BarChart3, CheckCircle, Clock, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useAnalytics } from '@/hooks/use-analytics'
import { StatusChart } from '@/components/analytics/status-chart'
import { UrgencyChart } from '@/components/analytics/urgency-chart'
import { TrendChart } from '@/components/analytics/trend-chart'
import { CategoryChart } from '@/components/analytics/category-chart'
import { RoleChart } from '@/components/analytics/role-chart'

function KpiSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="h-4 w-20 animate-pulse rounded bg-muted" />
        <div className="mt-2 h-8 w-16 animate-pulse rounded bg-muted" />
      </CardContent>
    </Card>
  )
}

function ChartSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="h-4 w-32 animate-pulse rounded bg-muted" />
        <div className="mt-2 h-3 w-48 animate-pulse rounded bg-muted" />
        <div className="mt-6 h-[200px] animate-pulse rounded bg-muted" />
      </CardContent>
    </Card>
  )
}

const kpis = [
  { label: 'Total Reportes', icon: BarChart3, key: 'totalReports' as const, format: (v: number) => v.toString() },
  { label: 'Tasa de Resolución', icon: CheckCircle, key: 'resolvedRate' as const, format: (v: number) => `${v}%` },
  { label: 'Tiempo Promedio', icon: Clock, key: 'avgResolutionHours' as const, format: (v: number) => `${v}h` },
  { label: 'Total Usuarios', icon: Users, key: 'totalUsers' as const, format: (v: number) => v.toString() },
]

export function AnalyticsPage() {
  const {
    isLoading,
    totalReports,
    resolvedRate,
    avgResolutionHours,
    totalUsers,
    statusData,
    urgencyData,
    categoryData,
    roleData,
    trendData,
  } = useAnalytics()

  const values = { totalReports, resolvedRate, avgResolutionHours, totalUsers }

  return (
    <div className="flex flex-col gap-6 overflow-y-auto p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analíticas</h1>
        <p className="text-sm text-muted-foreground">
          Resumen de actividad de la plataforma
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <KpiSkeleton key={i} />)
          : kpis.map((kpi) => (
              <Card key={kpi.key}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <kpi.icon className="h-4 w-4" />
                    {kpi.label}
                  </div>
                  <p className="mt-1 text-2xl font-bold">{kpi.format(values[kpi.key])}</p>
                </CardContent>
              </Card>
            ))}
      </div>

      {/* Status + Urgency */}
      <div className="grid gap-4 md:grid-cols-2">
        {isLoading ? (
          <>
            <ChartSkeleton />
            <ChartSkeleton />
          </>
        ) : (
          <>
            <StatusChart data={statusData} />
            <UrgencyChart data={urgencyData} />
          </>
        )}
      </div>

      {/* Trend */}
      {isLoading ? <ChartSkeleton /> : <TrendChart data={trendData} />}

      {/* Category + Roles */}
      <div className="grid gap-4 md:grid-cols-2">
        {isLoading ? (
          <>
            <ChartSkeleton />
            <ChartSkeleton />
          </>
        ) : (
          <>
            <CategoryChart data={categoryData} />
            <RoleChart data={roleData} />
          </>
        )}
      </div>
    </div>
  )
}
