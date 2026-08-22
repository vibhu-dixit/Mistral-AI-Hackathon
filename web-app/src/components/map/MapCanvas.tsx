"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer } from "react-leaflet";

import { HazardPin } from "@/components/map/HazardPin";
import type { Hazard } from "@/lib/types";

const SAN_FRANCISCO: [number, number] = [37.7749, -122.4194];

interface MapCanvasProps {
  hazards: Hazard[];
  onSelectHazard: (id: string) => void;
  hoveredHazardId?: string | null;
  onHoverHazard?: (id: string | null) => void;
}

/**
 * Purely presentational — hazards in, pin-click/hover out. Uses
 * OpenStreetMap tiles via Leaflet so there's no API token dependency; swap
 * the TileLayer for Mapbox GL if/when a token is available (see PLAN.md §1).
 */
export function MapCanvas({
  hazards,
  onSelectHazard,
  hoveredHazardId = null,
  onHoverHazard = () => {},
}: MapCanvasProps) {
  return (
    <MapContainer
      center={SAN_FRANCISCO}
      zoom={13}
      scrollWheelZoom
      className="h-full w-full rounded-2xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {hazards.map((hazard) => (
        <HazardPin
          key={hazard.id}
          hazard={hazard}
          onSelect={onSelectHazard}
          isHighlighted={hoveredHazardId === hazard.id}
          onHover={onHoverHazard}
        />
      ))}
    </MapContainer>
  );
}
