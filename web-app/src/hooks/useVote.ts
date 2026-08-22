import { useState } from "react";

type VoteDirection = "up" | "down" | null;

const STORAGE_PREFIX = "roadwatch:vote:";

function readStoredVote(hazardId: string): VoteDirection {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_PREFIX + hazardId);
  return raw === "up" || raw === "down" ? raw : null;
}

function writeStoredVote(hazardId: string, direction: VoteDirection) {
  if (typeof window === "undefined") return;
  if (direction) {
    window.localStorage.setItem(STORAGE_PREFIX + hazardId, direction);
  } else {
    window.localStorage.removeItem(STORAGE_PREFIX + hazardId);
  }
}

/**
 * No backend vote endpoint exists yet, so the user's own vote is tracked
 * client-side (per-browser, via localStorage) and layered on top of the
 * hazard's base `votes` count from the live hazard. Swap this for a
 * real mutation once the AI/Backend lead exposes a vote endpoint — the
 * component using this hook (VoteWidget) doesn't need to change.
 */
export function useVote(hazardId: string, baseVotes: number) {
  const [direction, setDirection] = useState<VoteDirection>(() => readStoredVote(hazardId));

  function castVote(next: Exclude<VoteDirection, null>) {
    const resolved = direction === next ? null : next;
    setDirection(resolved);
    writeStoredVote(hazardId, resolved);
  }

  const delta = direction === "up" ? 1 : direction === "down" ? -1 : 0;

  return {
    score: baseVotes + delta,
    direction,
    upvote: () => castVote("up"),
    downvote: () => castVote("down"),
  };
}
