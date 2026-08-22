export function formatDetectedAt(iso: string): string {
  const date = new Date(iso);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function formatDistance(meters: number): string {
  return `${Math.round(meters)} meters`;
}

/** Road construction dates read better as "Built March 2019" than a precise day/time. */
export function formatConstructionDate(iso: string): string {
  const date = new Date(iso);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}
