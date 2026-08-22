import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-rw-brand-start to-rw-brand-end text-white shadow-sm hover:opacity-90",
  secondary:
    "border border-rw-border bg-rw-surface text-rw-text hover:bg-rw-bg",
  ghost: "text-rw-text hover:bg-rw-border/40",
};

/**
 * One gradient element per screen, max — the primary variant is the only
 * place the brand gradient appears, so it stays a signal instead of noise.
 * See PLAN.md §2.
 */
export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
        VARIANT_CLASSES[variant],
        className,
      )}
      {...props}
    />
  );
}
