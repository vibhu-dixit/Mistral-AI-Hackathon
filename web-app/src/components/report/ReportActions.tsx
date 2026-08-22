"use client";

import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { useSubmitReport } from "@/hooks/useHazard";
import type { Hazard } from "@/lib/types";

/**
 * Submission is simulated for the hackathon per the brief — this flips the
 * hazard's status client-side through the same hook the rest of the app
 * uses, rather than calling a real municipal system. See PLAN.md §6.
 */
export function ReportActions({ hazard }: { hazard: Hazard }) {
  const submit = useSubmitReport(hazard.id);
  const isReported = hazard.status === "reported" || submit.isSuccess;

  if (isReported) {
    return (
      <div className="flex items-center gap-2 rounded-full bg-rw-status-reported/10 px-4 py-2 text-sm font-medium text-rw-status-reported">
        <CheckCircle2 className="h-4 w-4" />
        Report submitted (simulated)
      </div>
    );
  }

  return (
    <Button onClick={() => submit.mutate()} disabled={submit.isPending}>
      {submit.isPending ? "Submitting..." : "Submit Report"}
    </Button>
  );
}
