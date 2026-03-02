import { useState, useCallback } from 'react'
import { useReports } from '@/hooks/use-reports'
import { StatCards } from '@/components/dashboard/stat-cards'
import { ReportMap } from '@/components/dashboard/report-map'
import { ReportList } from '@/components/dashboard/report-list'
import { ReportDetail } from '@/components/dashboard/report-detail'
import { Map, List } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ReportStatus, Urgency } from '@/lib/types'

type MobileTab = 'map' | 'list'

export function DashboardPage() {
  const { reports, stats, isLoading, filters, setFilters } = useReports()
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null)
  const [viewingReportId, setViewingReportId] = useState<string | null>(null)
  const [mobileTab, setMobileTab] = useState<MobileTab>('map')

  const handleSelectReport = useCallback((id: string) => {
    setSelectedReportId(id)
    setViewingReportId(id)
    setMobileTab('list') // show detail on mobile when selecting from map
  }, [])

  const handleBackToList = useCallback(() => {
    setViewingReportId(null)
  }, [])

  const handleStatusFilterFromCard = useCallback(
    (status: ReportStatus | 'ALL') => {
      setFilters((prev) => ({ ...prev, status }))
    },
    [setFilters],
  )

  const handleStatusChange = useCallback(
    (status: ReportStatus | 'ALL') => {
      setFilters((prev) => ({ ...prev, status }))
    },
    [setFilters],
  )

  const handleUrgencyChange = useCallback(
    (urgency: Urgency | 'ALL') => {
      setFilters((prev) => ({ ...prev, urgency }))
    },
    [setFilters],
  )

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Cargando reportes...</p>
      </div>
    )
  }

  const listOrDetail = viewingReportId ? (
    <ReportDetail reportId={viewingReportId} onBack={handleBackToList} />
  ) : (
    <ReportList
      reports={reports}
      selectedReportId={selectedReportId}
      onSelectReport={handleSelectReport}
      statusFilter={filters.status}
      urgencyFilter={filters.urgency}
      onStatusChange={handleStatusChange}
      onUrgencyChange={handleUrgencyChange}
    />
  )

  return (
    <div className="flex h-full flex-col">
      {/* Mobile tab bar */}
      <div className="flex shrink-0 border-b lg:hidden">
        <button
          type="button"
          className={cn(
            'flex flex-1 cursor-pointer items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors',
            mobileTab === 'map'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground',
          )}
          onClick={() => setMobileTab('map')}
        >
          <Map className="h-4 w-4" />
          Mapa
        </button>
        <button
          type="button"
          className={cn(
            'flex flex-1 cursor-pointer items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors',
            mobileTab === 'list'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground',
          )}
          onClick={() => setMobileTab('list')}
        >
          <List className="h-4 w-4" />
          Reportes
        </button>
      </div>

      {/* Mobile: toggled views */}
      <div className="flex min-h-0 flex-1 flex-col lg:hidden">
        {mobileTab === 'map' ? (
          <div className="flex min-h-0 flex-1 flex-col gap-2 p-3">
            <StatCards stats={stats} activeFilter={filters.status} onFilterClick={handleStatusFilterFromCard} />
            <div className="min-h-0 flex-1">
              <ReportMap
                reports={reports}
                selectedReportId={selectedReportId}
                onSelectReport={handleSelectReport}
              />
            </div>
          </div>
        ) : (
          <div className="min-h-0 flex-1 p-3">
            {listOrDetail}
          </div>
        )}
      </div>

      {/* Desktop: side-by-side layout */}
      <div className="hidden min-h-0 flex-1 gap-4 p-4 lg:flex">
        <div className="flex w-[70%] min-h-0 flex-col gap-3">
          <StatCards stats={stats} activeFilter={filters.status} onFilterClick={handleStatusFilterFromCard} />
          <div className="min-h-0 flex-1">
            <ReportMap
              reports={reports}
              selectedReportId={selectedReportId}
              onSelectReport={handleSelectReport}
            />
          </div>
        </div>
        <div className="w-[30%] min-h-0">
          {listOrDetail}
        </div>
      </div>
    </div>
  )
}
