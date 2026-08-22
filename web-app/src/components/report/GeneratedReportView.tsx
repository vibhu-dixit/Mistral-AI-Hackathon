import { SeverityBadge } from "@/components/hazard/SeverityBadge";
import { Card } from "@/components/ui/Card";
import { HAZARD_TYPE_LABEL, type Hazard } from "@/lib/types";

export function GeneratedReportView({ hazard }: { hazard: Hazard }) {
  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-rw-text-muted">
          {hazard.target_category}
        </span>
        <SeverityBadge severity={hazard.severity} />
      </div>

      <h2 className="text-lg font-semibold text-rw-text">
        {HAZARD_TYPE_LABEL[hazard.hazard_type]} — {hazard.location_label}
      </h2>

      <p className="leading-relaxed text-rw-text">{hazard.generated_report}</p>
    </Card>
  );
}
