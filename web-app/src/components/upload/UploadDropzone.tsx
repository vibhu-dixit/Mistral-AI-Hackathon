"use client";

import { UploadCloud } from "lucide-react";
import { useRef, useState } from "react";

import { cn } from "@/lib/cn";

interface UploadDropzoneProps {
  onFileSelected: (file: File, kind: "image" | "video") => void;
}

function kindOf(file: File): "image" | "video" | null {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  return null;
}

/** Accepts a single photo or a short video — matches the brief's photo + video flows. */
export function UploadDropzone({ onFileSelected }: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File | undefined) {
    if (!file) return;
    const kind = kindOf(file);
    if (!kind) return;
    onFileSelected(file, kind);
  }

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        handleFile(event.dataTransfer.files[0]);
      }}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-12 text-center transition",
        isDragging
          ? "border-rw-brand-start bg-rw-brand-start/5"
          : "border-rw-border hover:border-rw-text-muted",
      )}
    >
      <UploadCloud className="h-8 w-8 text-rw-text-muted" strokeWidth={1.5} />
      <div>
        <p className="font-medium text-rw-text">Drop a photo or short video</p>
        <p className="mt-1 text-sm text-rw-text-muted">
          or click to browse — street footage from walking, biking, or driving
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={(event) => handleFile(event.target.files?.[0])}
      />
    </div>
  );
}
