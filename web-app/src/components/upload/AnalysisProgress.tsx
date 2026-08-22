import { Card } from "@/components/ui/Card";
import { ProgressStepper } from "@/components/ui/ProgressStepper";
import type { AnalyzeResponse } from "@/lib/types";

interface AnalysisProgressProps {
  stages: readonly string[];
  stageIndex: number;
  isSuccess: boolean;
  data?: AnalyzeResponse;
}

/** Matches the brief's "N hazards detected" result summary (§8, §20 Scene 4). */
export function AnalysisProgress({ stages, stageIndex, isSuccess, data }: AnalysisProgressProps) {
  return (
    <Card className="space-y-5">
      <ProgressStepper stages={stages} activeIndex={stageIndex} done={isSuccess} />

      {isSuccess && data && (
        <div className="rounded-xl bg-rw-bg p-4 text-sm text-rw-text">
          <span className="font-semibold">{data.hazards.length}</span>{" "}
          {data.hazards.length === 1 ? "hazard" : "hazards"} detected
          {data.frame_count ? ` across ${data.frame_count} sampled frames` : ""}.
        </div>
      )}
    </Card>
  );
}
