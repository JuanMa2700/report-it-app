import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import { MAP_DEFAULT_CENTER, MAP_DEFAULT_ZOOM, STATUS_MAP_COLORS, STATUS_LABELS } from '@/lib/constants'
import type { Report } from '@/lib/types'
import 'leaflet/dist/leaflet.css'

interface ReportMapProps {
  reports: Report[]
  selectedReportId: string | null
  onSelectReport: (id: string) => void
}

function FlyToReport({ reports, selectedReportId }: { reports: Report[]; selectedReportId: string | null }) {
  const map = useMap()
  const prevSelectedId = useRef<string | null>(null)

  useEffect(() => {
    if (selectedReportId && selectedReportId !== prevSelectedId.current) {
      const report = reports.find((r) => r.id === selectedReportId)
      if (report?.latitude && report?.longitude) {
        map.flyTo([report.latitude, report.longitude], 16, { duration: 0.8 })
      }
    }
    prevSelectedId.current = selectedReportId
  }, [selectedReportId, reports, map])

  return null
}

export function ReportMap({ reports, selectedReportId, onSelectReport }: ReportMapProps) {
  const geoReports = reports.filter((r) => r.latitude != null && r.longitude != null)

  return (
    <div className="h-full w-full overflow-hidden rounded-lg border">
      <MapContainer
        center={MAP_DEFAULT_CENTER}
        zoom={MAP_DEFAULT_ZOOM}
        className="h-full w-full"
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FlyToReport reports={reports} selectedReportId={selectedReportId} />
        {geoReports.map((report) => (
          <CircleMarker
            key={report.id}
            center={[report.latitude!, report.longitude!]}
            radius={report.id === selectedReportId ? 12 : 8}
            pathOptions={{
              color: STATUS_MAP_COLORS[report.status],
              fillColor: STATUS_MAP_COLORS[report.status],
              fillOpacity: report.id === selectedReportId ? 0.9 : 0.6,
              weight: report.id === selectedReportId ? 3 : 2,
            }}
            eventHandlers={{
              click: () => onSelectReport(report.id),
            }}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-semibold">{report.title}</p>
                <p className="text-gray-600">{report.category.name}</p>
                <p className="text-gray-500">{STATUS_LABELS[report.status]}</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  )
}
