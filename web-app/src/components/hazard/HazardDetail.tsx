import { Copy, MapPin } from "lucide-react";
import Link from "next/link";

import { AIReasoningBlock } from "@/components/hazard/AIReasoningBlock";
import { ConfidenceMeter } from "@/components/hazard/ConfidenceMeter";
import { HazardImage } from "@/components/hazard/HazardImage";
import { RoadRecord } from "@/components/hazard/RoadRecord";
import { SeverityBadge } from "@/components/hazard/SeverityBadge";
import { StatusBadge } from "@/components/hazard/StatusBadge";
import { StreetPermitInfo } from "@/components/hazard/StreetPermitInfo";
import { VoteWidget } from "@/components/hazard/VoteWidget";
import { Button } from "@/components/ui/Button";
import { formatDetectedAt, formatDistance } from "@/lib/format";
import { HAZARD_TYPE_LABEL, type Hazard } from "@/lib/types";

/**
 * The single source of truth for how a hazard renders — used by both the
 * dashboard's click-through modal and the standalone /hazard/[id] page, so
 * the two contexts can't drift out of sync. See PLAN.md §3/§4.
 */
export function HazardDetail({ hazard }: { hazard: Hazard }) {
  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-rw-text">
            {HAZARD_TYPE_LABEL[hazard.hazard_type]}
          </h2>
          <p className="mt-1 flex items-center gap-1 text-sm text-rw-text-muted">
            <MapPin className="h-4 w-4" />
            {hazard.location_label}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <SeverityBadge severity={hazard.severity} />
          <StatusBadge status={hazard.status} />
          <VoteWidget hazardId={hazard.id} votes={hazard.votes} />
        </div>
      </div>

      <HazardImage
        src={hazard.image_url}
        alt={HAZARD_TYPE_LABEL[hazard.hazard_type]}
        className="h-56 w-full rounded-xl object-cover"
      />

      {hazard.duplicate && (
        <div className="flex items-center gap-2 rounded-xl border border-rw-accent-navy/30 bg-rw-accent-navy/5 px-4 py-3 text-sm text-rw-accent-navy">
          <Copy className="h-4 w-4 shrink-0" />
          Possible duplicate found
          {hazard.duplicate_distance_m != null
            ? ` ${formatDistance(hazard.duplicate_distance_m)} away.`
            : "."}
        </div>
      )}

      <ConfidenceMeter confidence={hazard.confidence} />

      <dl className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-rw-text-muted">Detected</dt>
          <dd className="text-rw-text">{formatDetectedAt(hazard.detected_at)}</dd>
        </div>
        <div>
          <dt className="text-rw-text-muted">Category</dt>
          <dd className="text-rw-text">{hazard.target_category}</dd>
        </div>
        <div>
          <dt className="text-rw-text-muted">Priority score</dt>
          <dd className="text-rw-text">{hazard.priority_score}/100</dd>
        </div>
      </dl>

      <StreetPermitInfo hazard={hazard} />

      <AIReasoningBlock text={hazard.ai_reasoning} />

      <RoadRecord author={hazard.road_author} constructedAt={hazard.road_constructed_at} />

      <div>
        <p className="mb-3 text-sm text-rw-text-muted">
          {hazard.status === "reported"
            ? "Report already submitted."
            : "Ready for submission."}
        </p>
        <Link href={`/report/${hazard.id}`}>
          <Button>View generated report</Button>
        </Link>
      </div>
    </div>
  );
}
