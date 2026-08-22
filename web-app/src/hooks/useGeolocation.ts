import { useRef, useState } from "react";

export type GeoStatus =
  | "idle"
  | "requesting"
  | "granted"
  | "denied"
  | "unavailable"
  | "timeout"
  | "unsupported";

/**
 * Per the brief's photo/video flow (§7 Step 1): "Location metadata is
 * captured from the device when available." Requested on a user gesture
 * (file selection), not on page load, so the browser's permission prompt
 * doesn't surprise the user before they've done anything.
 *
 * The browser's Geolocation error callback fires for three distinct
 * reasons (PERMISSION_DENIED, POSITION_UNAVAILABLE, TIMEOUT) — this used
 * to collapse all three into "denied", which actively misreported the
 * cause whenever it was really a timeout or no GPS fix, not a real denial.
 */
export function useGeolocation() {
  const [status, setStatus] = useState<GeoStatus>("idle");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  // Guards against a stale watchdog/callback firing after a newer request()
  // call has already superseded it.
  const requestIdRef = useRef(0);

  function request() {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("unsupported");
      return;
    }

    const requestId = ++requestIdRef.current;
    setStatus("requesting");

    // Safari has known bugs where the `timeout` option below doesn't
    // reliably fire the error callback (e.g. an ignored/missed permission
    // prompt can leave the request hanging indefinitely). This watchdog
    // guarantees the UI reaches a terminal state within ~12s regardless,
    // so "Getting your location..." can never get stuck forever.
    const watchdog = setTimeout(() => {
      if (requestIdRef.current === requestId) setStatus("timeout");
    }, 12_000);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (requestIdRef.current !== requestId) return;
        clearTimeout(watchdog);
        setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
        setStatus("granted");
      },
      (error) => {
        if (requestIdRef.current !== requestId) return;
        clearTimeout(watchdog);
        if (error.code === error.PERMISSION_DENIED) {
          setStatus("denied");
        } else if (error.code === error.TIMEOUT) {
          setStatus("timeout");
        } else {
          setStatus("unavailable");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10_000,
        // Reuse a fix from the last 30s instead of forcing a brand-new GPS
        // lock on every request — a pothole's location doesn't change
        // between two photos taken moments apart, and this is the main
        // lever for making repeat requests feel instant instead of always
        // paying the full GPS cold-start cost.
        maximumAge: 30_000,
      },
    );
  }

  return { status, coords, request };
}
