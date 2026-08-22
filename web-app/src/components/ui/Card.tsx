import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-rw-border bg-rw-surface p-5 shadow-sm",
        className,
      )}
      {...props}
    />
  );
}
