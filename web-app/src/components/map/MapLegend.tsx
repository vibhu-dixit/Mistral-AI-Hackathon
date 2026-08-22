import { SEVERITY_COLOR } from "@/lib/severity";
import { SEVERITY_LABEL, type Severity } from "@/lib/types";

const SEVERITIES = Object.keys(SEVERITY_LABEL) as Severity[];

export function MapLegend() {
  return (
    <div className="flex items-center gap-4 rounded-full border border-rw-border bg-rw-surface px-4 py-2 text-xs text-rw-text-muted">
      {SEVERITIES.map((severity) => (
        <span key={severity} className="flex items-center gap-1.5">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: SEVERITY_COLOR[severity] }}
          />
          {SEVERITY_LABEL[severity]}
        </span>
      ))}
    </div>
  );
}
