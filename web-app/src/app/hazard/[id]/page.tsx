"use client";

import { use } from "react";

import { HazardDetail } from "@/components/hazard/HazardDetail";
import { useHazard } from "@/hooks/useHazard";

export default function HazardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: hazard, isLoading } = useHazard(id);

  if (isLoading) {
    return <p className="mx-auto max-w-2xl px-6 py-16 text-rw-text-muted">Loading…</p>;
  }

  if (!hazard) {
    return <p className="mx-auto max-w-2xl px-6 py-16 text-rw-text-muted">Hazard not found.</p>;
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <HazardDetail hazard={hazard} />
    </div>
  );
}
