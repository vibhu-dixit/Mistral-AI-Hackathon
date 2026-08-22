"use client";

import { ArrowBigDown, ArrowBigUp } from "lucide-react";

import { cn } from "@/lib/cn";
import { useVote } from "@/hooks/useVote";

interface VoteWidgetProps {
  hazardId: string;
  votes: number;
  size?: "sm" | "md";
}

/**
 * Lets citizens upvote/downvote a hazard to help prioritize it — appears
 * on every hazard card and detail view. See useVote for how the vote is
 * tracked ahead of a real backend endpoint.
 */
export function VoteWidget({ hazardId, votes, size = "md" }: VoteWidgetProps) {
  const { score, direction, upvote, downvote } = useVote(hazardId, votes);

  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const padding = size === "sm" ? "px-2 py-1" : "px-3 py-1.5";
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-rw-border/40",
        padding,
      )}
      onClick={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        aria-label="Upvote"
        aria-pressed={direction === "up"}
        onClick={upvote}
        className={cn(
          "flex items-center justify-center rounded-full transition hover:bg-rw-border",
          direction === "up" ? "text-rw-brand-start" : "text-rw-text-muted",
        )}
      >
        <ArrowBigUp className={iconSize} strokeWidth={2} fill={direction === "up" ? "currentColor" : "none"} />
      </button>

      <span className={cn("min-w-[1.5rem] text-center font-semibold text-rw-text", textSize)}>
        {score.toLocaleString()}
      </span>

      <button
        type="button"
        aria-label="Downvote"
        aria-pressed={direction === "down"}
        onClick={downvote}
        className={cn(
          "flex items-center justify-center rounded-full transition hover:bg-rw-border",
          direction === "down" ? "text-rw-accent-navy" : "text-rw-text-muted",
        )}
      >
        <ArrowBigDown className={iconSize} strokeWidth={2} fill={direction === "down" ? "currentColor" : "none"} />
      </button>
    </div>
  );
}
