import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReportListItem } from "./report-list-item";
import {
  STATUS_LABELS,
  URGENCY_LABELS,
  ALL_STATUSES,
  ALL_URGENCIES,
} from "@/lib/constants";
import type { Report, ReportStatus, Urgency } from "@/lib/types";

interface ReportListProps {
  reports: Report[];
  selectedReportId: string | null;
  onSelectReport: (id: string) => void;
  statusFilter: ReportStatus | "ALL";
  urgencyFilter: Urgency | "ALL";
  onStatusChange: (val: ReportStatus | "ALL") => void;
  onUrgencyChange: (val: Urgency | "ALL") => void;
}

export function ReportList({
  reports,
  selectedReportId,
  onSelectReport,
  statusFilter,
  urgencyFilter,
  onStatusChange,
  onUrgencyChange,
}: ReportListProps) {
  return (
    <div className="flex h-full flex-col rounded-lg border bg-background">
      <div className="flex shrink-0 gap-2 border-b p-3">
        <Select
          value={statusFilter}
          onValueChange={(v) => onStatusChange(v as ReportStatus | "ALL")}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos los estados</SelectItem>
            {ALL_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {STATUS_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={urgencyFilter}
          onValueChange={(v) => onUrgencyChange(v as Urgency | "ALL")}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Urgencia" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todas las urgencias</SelectItem>
            {ALL_URGENCIES.map((u) => (
              <SelectItem key={u} value={u}>
                {URGENCY_LABELS[u]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="min-h-0 flex-1">
        <ScrollArea className="h-full">
          <div className="space-y-2 p-3">
            {reports.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No hay reportes
              </p>
            ) : (
              reports.map((report) => (
                <ReportListItem
                  key={report.id}
                  report={report}
                  isSelected={report.id === selectedReportId}
                  onClick={() => onSelectReport(report.id)}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </div>
      <div className="shrink-0 border-t p-2 text-center text-xs text-muted-foreground">
        {reports.length} reporte{reports.length !== 1 && "s"}
      </div>
    </div>
  );
}
