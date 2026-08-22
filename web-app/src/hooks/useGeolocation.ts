import { useState } from "react";

export type GeoStatus = "idle" | "requesting" | "granted" | "denied" | "unsupported";

/**
 * Per the brief's photo/video flow (§7 Step 1): "Location metadata is
 * captured from the device when available." Requested on a user gesture
 * (file selection), not on page load, so the browser's permission prompt
 * doesn't surprise the user before they've done anything.
 */
export function useGeolocation() {
  const [status, setStatus] = useState<GeoStatus>("idle");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  function request() {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("unsupported");
      return;
    }

    setStatus("requesting");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
        setStatus("granted");
      },
      () => setStatus("denied"),
      { enableHighAccuracy: true, timeout: 10_000 },
    );
  }

  return { status, coords, request };
}
