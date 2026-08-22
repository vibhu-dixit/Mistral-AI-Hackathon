import { Check, Loader2 } from "lucide-react";

interface ProgressStepperProps {
  stages: readonly string[];
  activeIndex: number;
  done?: boolean;
}

/** Drives the "Scanning frames... / Hazards detected... / ..." sequence. */
export function ProgressStepper({ stages, activeIndex, done = false }: ProgressStepperProps) {
  return (
    <ol className="space-y-3">
      {stages.map((stage, index) => {
        const isComplete = done || index < activeIndex;
        const isActive = !done && index === activeIndex;

        return (
          <li key={stage} className="flex items-center gap-3">
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
              style={{
                backgroundColor: isComplete
                  ? "var(--rw-accent-navy)"
                  : isActive
                    ? "var(--rw-brand-start)"
                    : "var(--rw-border)",
              }}
            >
              {isComplete ? (
                <Check className="h-3.5 w-3.5 text-white" />
              ) : isActive ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
              ) : null}
            </span>
            <span
              className={
                isComplete || isActive ? "text-rw-text" : "text-rw-text-muted"
              }
            >
              {stage}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
