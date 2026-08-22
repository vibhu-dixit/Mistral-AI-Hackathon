import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

import { analyzeImage, analyzeVideo } from "@/lib/api/client";
import type { AnalyzeResponse } from "@/lib/types";

/** Matches the brief's exact processing-screen copy (§7 Step 2 / §20 Scene 3). */
export const ANALYSIS_STAGES = [
  "Scanning frames...",
  "Hazards detected...",
  "Reading location context...",
  "Checking existing reports...",
  "Prioritizing...",
] as const;

type MediaKind = "image" | "video";

interface AnalyzeInput {
  file: File;
  kind: MediaKind;
  coords?: { lat: number; lng: number };
}

export function useAnalyzeUpload() {
  const [stageIndex, setStageIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const mutation = useMutation<AnalyzeResponse, Error, AnalyzeInput>({
    mutationFn: ({ file, kind, coords }) =>
      kind === "video" ? analyzeVideo(file, coords) : analyzeImage(file, coords),
  });

  useEffect(() => {
    if (!mutation.isPending) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      return;
    }

    timerRef.current = setInterval(() => {
      setStageIndex((current) =>
        current < ANALYSIS_STAGES.length - 1 ? current + 1 : current,
      );
    }, 700);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [mutation.isPending]);

  function analyze(input: AnalyzeInput) {
    setStageIndex(0);
    mutation.mutate(input);
  }

  function analyzeAsync(input: AnalyzeInput) {
    setStageIndex(0);
    return mutation.mutateAsync(input);
  }

  return {
    analyze,
    analyzeAsync,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    data: mutation.data,
    stage: ANALYSIS_STAGES[stageIndex],
    stageIndex,
    stages: ANALYSIS_STAGES,
    reset: mutation.reset,
  };
}
