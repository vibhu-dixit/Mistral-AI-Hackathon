import { ImageOff } from "lucide-react";

import { cn } from "@/lib/cn";

/**
 * The gray empty box shown whenever a hazard's image_url is null — which,
 * per the mock skeleton data, is every hazard until a real photo is wired
 * up. See PLAN.md §5.2 / §6.
 */
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
