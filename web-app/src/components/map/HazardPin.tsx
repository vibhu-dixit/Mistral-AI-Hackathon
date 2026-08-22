"use client";

import { useEffect, useRef } from "react";
import { CircleMarker, Popup } from "react-leaflet";
import type { CircleMarker as LeafletCircleMarker } from "leaflet";

import { SEVERITY_COLOR } from "@/lib/severity";
import { HAZARD_TYPE_LABEL, type Hazard } from "@/lib/types";

interface HazardPinProps {
  hazard: Hazard;
  onSelect: (id: string) => void;
  isHighlighted: boolean;
  onHover: (id: string | null) => void;
}

/**
 * Uses CircleMarker (not the default Leaflet marker icon) so there's no
 * dependency on shipping/configuring marker image assets — one less thing
 * to break before a demo. Grows and comes to front when highlighted, either
 * by hovering this pin directly or hovering its matching sidebar card.
 */
export function HazardPin({ hazard, onSelect, isHighlighted, onHover }: HazardPinProps) {
  const markerRef = useRef<LeafletCircleMarker>(null);

  useEffect(() => {
    if (isHighlighted) markerRef.current?.bringToFront();
  }, [isHighlighted]);

  if (!hazard.latitude && !hazard.longitude) return null;
  const color = SEVERITY_COLOR[hazard.severity];

  return (
    <CircleMarker
      ref={markerRef}
      center={[hazard.latitude, hazard.longitude]}
      radius={isHighlighted ? 14 : 9}
      pathOptions={{
        color,
        fillColor: color,
        fillOpacity: isHighlighted ? 1 : 0.85,
        weight: isHighlighted ? 4 : 2,
      }}
      eventHandlers={{
        click: () => onSelect(hazard.id),
        mouseover: () => onHover(hazard.id),
        mouseout: () => onHover(null),
      }}
    >
      <Popup>
        <strong>{HAZARD_TYPE_LABEL[hazard.hazard_type]}</strong>
        <br />
        {hazard.location_label}
      </Popup>
    </CircleMarker>
  );
}
