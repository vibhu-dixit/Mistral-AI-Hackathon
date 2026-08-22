"use client";

import { Camera } from "lucide-react";
import { useRef } from "react";

interface CameraCaptureButtonProps {
  onCapture: (file: File) => void;
}

/**
 * `capture="environment"` opens the device's rear camera directly on
 * mobile browsers instead of the generic file/gallery picker — this is
 * kept as a separate control from UploadDropzone so picking an existing
 * photo or a pre-recorded video (the video-flow use case) still works too.
 * On desktop, `capture` is ignored and this just opens a normal file
 * picker.
 */
export function CameraCaptureButton({ onCapture }: CameraCaptureButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rw-brand-start to-rw-brand-end px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
    >
      <Camera className="h-4 w-4" />
      Take a photo
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onCapture(file);
          event.target.value = "";
        }}
      />
    </button>
  );
}
