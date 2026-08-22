import { AlertCircle, Loader2, MapPin, MapPinOff } from "lucide-react";

import type { GeoStatus } from "@/hooks/useGeolocation";

interface LocationStatusProps {
  status: GeoStatus;
  coords: { lat: number; lng: number } | null;
}

export function LocationStatus({ status, coords }: LocationStatusProps) {
  if (status === "idle") return null;

  if (status === "requesting") {
    return (
      <p className="flex items-center gap-1.5 text-sm text-rw-text-muted">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        Getting your location…
      </p>
    );
  }

  if (status === "granted" && coords) {
    return (
      <p className="flex items-center gap-1.5 text-sm text-rw-accent-navy">
        <MapPin className="h-3.5 w-3.5" />
        Location captured ({coords.lat.toFixed(4)}, {coords.lng.toFixed(4)})
      </p>
    );
  }

  if (status === "denied") {
    return (
      <p className="flex items-center gap-1.5 text-sm text-rw-text-muted">
        <AlertCircle className="h-3.5 w-3.5" />
        Location permission denied — continuing without it.
      </p>
    );
  }

  return (
    <p className="flex items-center gap-1.5 text-sm text-rw-text-muted">
      <MapPinOff className="h-3.5 w-3.5" />
      Location isn&rsquo;t available on this device — continuing without it.
    </p>
  );
}
