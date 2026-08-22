import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { updateHazardVotes } from "@/lib/api/client";

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

function directionValue(direction: VoteDirection): number {
  if (direction === "up") return 1;
  if (direction === "down") return -1;
  return 0;
}

export function useVote(hazardId: string, baseVotes: number) {
  const queryClient = useQueryClient();
  const [direction, setDirection] = useState<VoteDirection>(() => readStoredVote(hazardId));
  const [optimistic, setOptimistic] = useState<number | null>(null);

  useEffect(() => {
    setOptimistic(null);
  }, [baseVotes]);

  function castVote(next: Exclude<VoteDirection, null>) {
    const resolved = direction === next ? null : next;
    const nextVotes = Math.max(0, (optimistic ?? baseVotes) + (directionValue(resolved) - directionValue(direction)));
    setDirection(resolved);
    writeStoredVote(hazardId, resolved);
    setOptimistic(nextVotes);
    void updateHazardVotes(hazardId, nextVotes).then(() => {
      queryClient.invalidateQueries({ queryKey: ["hazards"] });
      queryClient.invalidateQueries({ queryKey: ["hazard", hazardId] });
    });
  }

  return {
    score: optimistic ?? baseVotes,
    direction,
    upvote: () => castVote("up"),
    downvote: () => castVote("down"),
  };
}
