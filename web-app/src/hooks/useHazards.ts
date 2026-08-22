import { useQuery } from "@tanstack/react-query";

import { listHazards } from "@/lib/api/client";
import type { HazardFilters } from "@/lib/types";

/**
 * Components never call the API client directly — every screen goes
 * through a hook so loading/error/empty states stay consistent instead of
 * being reimplemented per-screen. See PLAN.md §5.4.
 */
export function useHazards(filters?: HazardFilters) {
  return useQuery({
    queryKey: ["hazards", filters],
    queryFn: () => listHazards(filters),
    staleTime: 0,
    refetchOnMount: "always",
  });
}
