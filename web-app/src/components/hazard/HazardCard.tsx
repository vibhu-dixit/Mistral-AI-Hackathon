import { MapPin } from "lucide-react";

import { SeverityBadge } from "@/components/hazard/SeverityBadge";
import { StatusBadge } from "@/components/hazard/StatusBadge";
import { VoteWidget } from "@/components/hazard/VoteWidget";
import { Card } from "@/components/ui/Card";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { cn } from "@/lib/cn";
import { formatDetectedAt } from "@/lib/format";
import { HAZARD_TYPE_LABEL, type Hazard } from "@/lib/types";

interface HazardCardProps {
  hazard: Hazard;
  onClick?: () => void;
  highlighted?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function HazardCard({
  hazard,
  onClick,
  highlighted = false,
  onMouseEnter,
  onMouseLeave,
}: HazardCardProps) {
  return (
    <Card
      role={onClick ? "button" : undefined}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        "flex gap-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg",
        highlighted
          ? "-translate-y-0.5 border-rw-brand-start shadow-lg ring-2 ring-rw-brand-start/40"
          : "hover:border-rw-brand-start/50",
      )}
    >
      {hazard.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element -- Supabase/public image URLs, no next/image domain config
        <img
          src={hazard.image_url}
          alt={HAZARD_TYPE_LABEL[hazard.hazard_type]}
          className="h-20 w-20 shrink-0 rounded-xl object-cover"
        />
      ) : (
        <ImagePlaceholder className="h-20 w-20 shrink-0" />
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate font-medium text-rw-text">
            {HAZARD_TYPE_LABEL[hazard.hazard_type]}
          </h3>
          <SeverityBadge severity={hazard.severity} />
        </div>

        <p className="mt-1 flex items-center gap-1 text-sm text-rw-text-muted">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{hazard.location_label}</span>
        </p>

        <div className="mt-2 flex items-center justify-between">
          <StatusBadge status={hazard.status} />
          <span className="text-xs text-rw-text-muted">
            {formatDetectedAt(hazard.detected_at)}
          </span>
        </div>

        <div className="mt-2">
          <VoteWidget hazardId={hazard.id} votes={hazard.votes} size="sm" />
        </div>
      </div>
    </Card>
  );
}
