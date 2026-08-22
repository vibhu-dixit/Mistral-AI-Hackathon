import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  color?: string; // a CSS color value; badge tints its own background from it
}

/**
 * Severity/status render as pill badges rather than coloring whole cards —
 * keeps the UI calm even when a "critical" item is in a list. See
 * PLAN.md §2.
 */
export function Badge({ color = "var(--rw-text-muted)", className, style, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        className,
      )}
      style={{
        color,
        backgroundColor: `color-mix(in srgb, ${color} 14%, transparent)`,
        ...style,
      }}
      {...props}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {children}
    </span>
  );
}
