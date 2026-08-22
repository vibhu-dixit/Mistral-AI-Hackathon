import { Landmark } from "lucide-react";

import { formatConstructionDate } from "@/lib/format";

interface RoadRecordProps {
  author?: string | null;
  constructedAt?: string | null;
}

/**
 * Who built/maintains this stretch of road and when — shown after the AI
 * reasoning block. This data isn't in the backend contract yet, so most
 * hazards won't have it; the component owns its own visibility rather than
 * making every caller repeat the null-check.
 */
export function RoadRecord({ author, constructedAt }: RoadRecordProps) {
  if (!author && !constructedAt) return null;

  return (
    <div className="rounded-xl border border-rw-border bg-rw-bg p-4">
      <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-rw-accent-navy">
        <Landmark className="h-3.5 w-3.5" />
        Road record
      </div>
      <p className="text-sm leading-relaxed text-rw-text">
        {author && <>Built by {author}</>}
        {author && constructedAt && " — "}
        {constructedAt && <>Constructed {formatConstructionDate(constructedAt)}</>}
      </p>
    </div>
  );
}
