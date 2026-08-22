"use client";

import { FileImage } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface MediaPreviewProps {
  file: File;
  kind: "image" | "video";
}

/**
 * Some formats (HEIC especially — the default iPhone camera format) can't
 * be decoded by most browsers' <img> tag at all: Chrome/Firefox/Edge have
 * no HEIC decoder, and even Safari's support is inconsistent for blob
 * URLs. That's a browser limitation, not a bug — the backend still
 * converts it to JPEG server-side for Mistral. Rather than showing the
 * browser's default broken-image icon, fall back to a clean "no preview"
 * state that still confirms the right file was picked.
 */
export function MediaPreview({ file, kind }: MediaPreviewProps) {
  const url = useMemo(() => URL.createObjectURL(file), [file]);
  const [failed, setFailed] = useState(false);

  // A new file means a new url — reset the failed state for it. Adjusting
  // state during render (React's documented pattern for this) instead of
  // in an effect avoids an extra render pass.
  const [failedFor, setFailedFor] = useState(url);
  if (url !== failedFor) {
    setFailedFor(url);
    setFailed(false);
  }

  useEffect(() => () => URL.revokeObjectURL(url), [url]);

  if (failed) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-dashed border-rw-border bg-rw-bg p-4">
        <FileImage className="h-8 w-8 shrink-0 text-rw-text-muted" strokeWidth={1.5} />
        <div className="min-w-0">
          <p className="text-sm font-medium text-rw-text">{file.name}</p>
          <p className="text-xs text-rw-text-muted">
            No preview available for this format — it&rsquo;ll still be analyzed normally.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-rw-border">
      {kind === "image" ? (
        // eslint-disable-next-line @next/next/no-img-element -- local object URL, not a next/image-eligible remote source
        <img
          src={url}
          alt="Selected upload"
          className="max-h-80 w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <video src={url} controls className="max-h-80 w-full" onError={() => setFailed(true)} />
      )}
    </div>
  );
}
