"use client";

import { useEffect, useState } from "react";

import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

interface HazardImageProps {
  src: string | null;
  alt: string;
  className?: string;
}

interface LoadState {
  src: string | null;
  blobUrl: string | null;
  failed: boolean;
}

const IDLE: LoadState = { src: null, blobUrl: null, failed: false };

/**
 * A plain <img src={hazard.image_url}> can't carry custom request headers
 * — but when the backend is behind an ngrok free-tier tunnel (phone
 * testing), every image request gets intercepted by ngrok's browser
 * warning page unless it carries `ngrok-skip-browser-warning`. So this
 * fetches the image data via fetch() (which *can* set that header) and
 * hands the browser a local blob URL instead. Works identically against a
 * plain (non-tunneled) backend too — the extra header is just ignored.
 */
export function HazardImage({ src, alt, className }: HazardImageProps) {
  const [state, setState] = useState<LoadState>(IDLE);

  useEffect(() => {
    if (!src) return;

    let cancelled = false;
    let objectUrl: string | null = null;

    fetch(src, { headers: { "ngrok-skip-browser-warning": "true" } })
      .then((res) => {
        if (!res.ok) throw new Error(`image request failed with status ${res.status}`);
        return res.blob();
      })
      .then((blob) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setState({ src, blobUrl: objectUrl, failed: false });
      })
      .catch(() => {
        if (!cancelled) setState({ src, blobUrl: null, failed: true });
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [src]);

  // Ignore state left over from a previous src while the new fetch is
  // still in flight — shows the placeholder instead of a stale image.
  const current = state.src === src ? state : IDLE;

  if (!src || current.failed || !current.blobUrl) {
    return <ImagePlaceholder className={className} />;
  }

  // eslint-disable-next-line @next/next/no-img-element -- local blob URL, not a next/image-eligible remote source
  return <img src={current.blobUrl} alt={alt} className={className} />;
}
