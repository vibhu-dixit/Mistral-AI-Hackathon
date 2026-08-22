"use client";

import { useEffect, useMemo } from "react";

interface MediaPreviewProps {
  file: File;
  kind: "image" | "video";
}

export function MediaPreview({ file, kind }: MediaPreviewProps) {
  const url = useMemo(() => URL.createObjectURL(file), [file]);

  useEffect(() => () => URL.revokeObjectURL(url), [url]);

  return (
    <div className="overflow-hidden rounded-2xl border border-rw-border">
      {kind === "image" ? (
        // eslint-disable-next-line @next/next/no-img-element -- local object URL, not a next/image-eligible remote source
        <img src={url} alt="Selected upload" className="max-h-80 w-full object-cover" />
      ) : (
        <video src={url} controls className="max-h-80 w-full" />
      )}
    </div>
  );
}
