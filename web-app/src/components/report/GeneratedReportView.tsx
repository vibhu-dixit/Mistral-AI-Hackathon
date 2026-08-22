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

      {(hazard.agent || hazard.agent_phone) && (
        <dl className="grid gap-2 border-t border-rw-border pt-4 text-sm">
          {hazard.agent ? (
            <div>
              <dt className="text-rw-text-muted">Contractor / agent</dt>
              <dd className="text-rw-text">{hazard.agent}</dd>
            </div>
          ) : null}
          {hazard.agent_phone ? (
            <div>
              <dt className="text-rw-text-muted">Agent phone</dt>
              <dd className="text-rw-text">
                <a className="underline decoration-rw-border underline-offset-2" href={`tel:${hazard.agent_phone}`}>
                  {hazard.agent_phone}
                </a>
              </dd>
            </div>
          ) : null}
        </dl>
      )}
    </Card>
  );
}
