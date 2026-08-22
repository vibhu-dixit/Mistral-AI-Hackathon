import { ImageOff } from "lucide-react";

import { cn } from "@/lib/cn";

/** Gray empty box shown when a stored hazard has no image URL. */
export function ImagePlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-xl border border-dashed border-rw-border bg-rw-border/30 text-rw-text-muted",
        className,
      )}
    >
      <ImageOff className="h-6 w-6" strokeWidth={1.5} />
    </div>
  );
}
