import { useState, useCallback } from 'react'
import { useReports } from '@/hooks/use-reports'
import { StatCards } from '@/components/dashboard/stat-cards'
import { ReportMap } from '@/components/dashboard/report-map'
import { ReportList } from '@/components/dashboard/report-list'
import { ReportDetail } from '@/components/dashboard/report-detail'
import type { ReportStatus, Urgency } from '@/lib/types'

export function DashboardPage() {
  const { reports, stats, isLoading, filters, setFilters, refetch } = useReports()
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null)
  const [viewingReportId, setViewingReportId] = useState<string | null>(null)

  const handleSelectReport = useCallback((id: string) => {
    setSelectedReportId(id)
    setViewingReportId(id)
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

  return (
    <div className="flex h-full gap-4 p-4">
      {/* Left column: stats + map */}
      <div className="flex w-[70%] flex-col gap-3 min-h-0">
        <StatCards stats={stats} activeFilter={filters.status} onFilterClick={handleStatusFilterFromCard} />
        <div className="flex-1 min-h-0">
          <ReportMap
            reports={reports}
            selectedReportId={selectedReportId}
            onSelectReport={handleSelectReport}
          />
        </div>
      </div>
      {/* Right column: list or detail (full height) */}
      <div className="w-[30%] min-h-0">
        {viewingReportId ? (
          <ReportDetail
            reportId={viewingReportId}
            onBack={handleBackToList}
            onReportUpdated={refetch}
          />
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
        )}
      </div>
    </div>
  )
}
