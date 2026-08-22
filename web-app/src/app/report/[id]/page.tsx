"use client";

import { use } from "react";

import { GeneratedReportView } from "@/components/report/GeneratedReportView";
import { ReportActions } from "@/components/report/ReportActions";
import { useHazard } from "@/hooks/useHazard";

export default function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: hazard, isLoading } = useHazard(id);

  if (isLoading) {
    return <p className="mx-auto max-w-2xl px-6 py-16 text-rw-text-muted">Loading…</p>;
  }

  if (!hazard) {
    return <p className="mx-auto max-w-2xl px-6 py-16 text-rw-text-muted">Hazard not found.</p>;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-6 py-16">
      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-rw-brand-start">
          Generated report
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-rw-text">Review &amp; submit</h1>
      </div>

      <GeneratedReportView hazard={hazard} />

      <ReportActions hazard={hazard} />
    </div>
  );
}
