"use client";

import { CircleMarker, Popup } from "react-leaflet";

import { SEVERITY_COLOR } from "@/lib/severity";
import { HAZARD_TYPE_LABEL, type Hazard } from "@/lib/types";

interface HazardPinProps {
  hazard: Hazard;
  onSelect: (id: string) => void;
}

/**
 * Uses CircleMarker (not the default Leaflet marker icon) so there's no
 * dependency on shipping/configuring marker image assets — one less thing
 * to break before a demo.
 */
export function HazardPin({ hazard, onSelect }: HazardPinProps) {
  if (!hazard.latitude && !hazard.longitude) return null;
  const color = SEVERITY_COLOR[hazard.severity];

  return (
    <CircleMarker
      center={[hazard.latitude, hazard.longitude]}
      radius={9}
      pathOptions={{ color, fillColor: color, fillOpacity: 0.85, weight: 2 }}
      eventHandlers={{ click: () => onSelect(hazard.id) }}
    >
      <Popup>
        <strong>{HAZARD_TYPE_LABEL[hazard.hazard_type]}</strong>
        <br />
        {hazard.location_label}
        <br />
        Street: {hazard.permit_street_name}
        <br />
        Agent: {hazard.agent}
        <br />
        Phone: {hazard.agent_phone}
      </Popup>
    </CircleMarker>
  );
}
