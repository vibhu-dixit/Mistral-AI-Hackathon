import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getHazard, submitReport } from "@/lib/api/client";

export function useHazard(id: string | undefined) {
  return useQuery({
    queryKey: ["hazard", id],
    queryFn: () => getHazard(id as string),
    enabled: Boolean(id),
  });
}

/** Simulated submission per the brief — flips status client-side. */
export function useSubmitReport(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => submitReport(id),
    onSuccess: ({ status }) => {
      queryClient.setQueryData(["hazard", id], (previous: unknown) =>
        previous && typeof previous === "object" ? { ...previous, status } : previous,
      );
      queryClient.invalidateQueries({ queryKey: ["hazards"] });
    },
  });
}
