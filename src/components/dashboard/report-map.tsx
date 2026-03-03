import { useEffect, useRef, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import {
  MAP_DEFAULT_CENTER,
  MAP_DEFAULT_ZOOM,
  STATUS_MAP_COLORS,
  STATUS_LABELS,
  STATUS_COLORS,
  URGENCY_LABELS,
  URGENCY_COLORS,
  PRIMARY_HEX,
} from "@/lib/constants";
import type { Report } from "@/lib/types";
import "leaflet/dist/leaflet.css";

interface ReportMapProps {
  reports: Report[];
  selectedReportId: string | null;
  onSelectReport: (id: string) => void;
}

function createMarkerIcon(color: string, isSelected: boolean) {
  const size = isSelected ? 20 : 14;
  const outerSize = isSelected ? 40 : 24;

  const pulseRing = isSelected
    ? `<span class="map-marker__pulse" style="border-color: ${PRIMARY_HEX}"></span>`
    : "";

  const borderColor = isSelected ? PRIMARY_HEX : "white";
  const borderWidth = isSelected ? 3 : 2;

  return L.divIcon({
    className: "map-marker-container",
    html: `
      <div class="map-marker ${isSelected ? "map-marker--selected" : ""}">
        ${pulseRing}
        <span
          class="map-marker__dot"
          style="
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border: ${borderWidth}px solid ${borderColor};
          "
        ></span>
      </div>
    `,
    iconSize: [outerSize, outerSize],
    iconAnchor: [outerSize / 2, outerSize / 2],
    popupAnchor: [0, -(outerSize / 2)],
  });
}

function FlyToReport({
  reports,
  selectedReportId,
}: {
  reports: Report[];
  selectedReportId: string | null;
}) {
  const map = useMap();
  const prevSelectedId = useRef<string | null>(null);

  useEffect(() => {
    if (selectedReportId && selectedReportId !== prevSelectedId.current) {
      const report = reports.find((r) => r.id === selectedReportId);
      if (report?.latitude && report?.longitude) {
        map.flyTo([report.latitude, report.longitude], 16, { duration: 0.8 });
      }
    }
    prevSelectedId.current = selectedReportId;
  }, [selectedReportId, reports, map]);

  return null;
}

function ReportMarker({
  report,
  isSelected,
  onSelect,
}: {
  report: Report;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const icon = useMemo(
    () => createMarkerIcon(PRIMARY_HEX, isSelected),
    [report.status, isSelected],
  );

  return (
    <Marker
      position={[report.latitude!, report.longitude!]}
      icon={icon}
      zIndexOffset={isSelected ? 1000 : 0}
      eventHandlers={{ click: onSelect }}
    >
      <Popup className="map-popup">
        <div className="map-popup__content">
          <div
            className="map-popup__accent"
            style={{ background: PRIMARY_HEX }}
          />
          <p className="map-popup__title">{report.title}</p>
          <p className="map-popup__category">{report.category.name}</p>
          <div className="map-popup__badges">
            <span
              className={`map-popup__badge ${STATUS_COLORS[report.status]}`}
            >
              {STATUS_LABELS[report.status]}
            </span>
            <span
              className={`map-popup__badge ${URGENCY_COLORS[report.urgency]}`}
            >
              {URGENCY_LABELS[report.urgency]}
            </span>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

export function ReportMap({
  reports,
  selectedReportId,
  onSelectReport,
}: ReportMapProps) {
  const geoReports = reports.filter(
    (r) => r.latitude != null && r.longitude != null,
  );

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
          <ReportMarker
            key={report.id}
            report={report}
            isSelected={report.id === selectedReportId}
            onSelect={() => onSelectReport(report.id)}
          />
        ))}
      </MapContainer>
    </div>
  );
}
