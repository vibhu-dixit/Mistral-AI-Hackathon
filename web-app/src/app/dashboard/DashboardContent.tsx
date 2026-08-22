"use client";

import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { HazardCard } from "@/components/hazard/HazardCard";
import { HazardDetail } from "@/components/hazard/HazardDetail";
import { MapFilters } from "@/components/map/MapFilters";
import { MapLegend } from "@/components/map/MapLegend";
import { Modal } from "@/components/ui/Modal";
import { useHazard } from "@/hooks/useHazard";
import { useHazards } from "@/hooks/useHazards";
import type { HazardFilters } from "@/lib/types";

// Leaflet touches `window`, so it can only render on the client.
const MapCanvas = dynamic(
  () => import("@/components/map/MapCanvas").then((mod) => mod.MapCanvas),
  { ssr: false },
);

export function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<HazardFilters>({});

  // Deep-link support: /dashboard?hazard=<id> opens straight into detail,
  // and /dashboard?highlight=<id,id> (from the analyze flow) opens the
  // first newly-detected hazard so it's visibly emphasized on arrival.
  // Read once at mount via the initializer — the URL a user lands on
  // shouldn't keep re-syncing into state on every param change.
  const [selectedId, setSelectedId] = useState<string | null>(() => {
    const hazardParam = searchParams.get("hazard");
    const highlightParam = searchParams.get("highlight");
    return hazardParam ?? highlightParam?.split(",")[0] ?? null;
  });

  const { data: hazards, isLoading } = useHazards(filters);
  const { data: selectedHazard } = useHazard(selectedId ?? undefined);

  function selectHazard(id: string) {
    setSelectedId(id);
    router.replace(`/dashboard?hazard=${id}`, { scroll: false });
  }

  function closeDetail() {
    setSelectedId(null);
    router.replace("/dashboard", { scroll: false });
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-65px)] max-w-7xl gap-6 px-6 py-6">
      <aside className="flex w-80 shrink-0 flex-col gap-6 overflow-y-auto">
        <div>
          <h1 className="text-xl font-semibold text-rw-text">Road condition map</h1>
          <p className="mt-1 text-sm text-rw-text-muted">
            {isLoading ? "Loading…" : `${hazards?.length ?? 0} hazards`}
          </p>
        </div>

        <MapFilters filters={filters} onChange={setFilters} />

        <div className="space-y-3">
          {hazards?.map((hazard) => (
            <HazardCard key={hazard.id} hazard={hazard} onClick={() => selectHazard(hazard.id)} />
          ))}
        </div>
      </aside>

      <div className="relative flex-1 overflow-hidden rounded-2xl border border-rw-border">
        {hazards && <MapCanvas hazards={hazards} onSelectHazard={selectHazard} />}
        <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2">
          <MapLegend />
        </div>
      </div>

      {selectedHazard && (
        <Modal onClose={closeDetail}>
          <HazardDetail hazard={selectedHazard} />
        </Modal>
      )}
    </div>
  );
}
