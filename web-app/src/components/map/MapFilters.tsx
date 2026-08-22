"use client";

import { cn } from "@/lib/cn";
import {
  HAZARD_TYPE_LABEL,
  SEVERITY_LABEL,
  STATUS_LABEL,
  type HazardFilters,
  type HazardStatus,
  type HazardType,
  type Severity,
} from "@/lib/types";

interface MapFiltersProps {
  filters: HazardFilters;
  onChange: (filters: HazardFilters) => void;
}

const HAZARD_TYPES = Object.keys(HAZARD_TYPE_LABEL) as HazardType[];
const SEVERITIES = Object.keys(SEVERITY_LABEL) as Severity[];
const STATUSES = Object.keys(STATUS_LABEL) as HazardStatus[];

function toggle<T>(list: T[] | undefined, value: T): T[] {
  const current = list ?? [];
  return current.includes(value)
    ? current.filter((item) => item !== value)
    : [...current, value];
}

function FilterGroup<T extends string>({
  label,
  options,
  labels,
  active,
  onToggle,
}: {
  label: string;
  options: T[];
  labels: Record<T, string>;
  active: T[] | undefined;
  onToggle: (value: T) => void;
}) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-rw-text-muted">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => {
          const isActive = active?.includes(option) ?? false;
          return (
            <button
              key={option}
              onClick={() => onToggle(option)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition",
                isActive
                  ? "border-rw-brand-start bg-rw-brand-start/10 text-rw-brand-start"
                  : "border-rw-border text-rw-text-muted hover:border-rw-text-muted",
              )}
            >
              {labels[option]}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Matches the brief's suggested filters exactly (§14). */
export function MapFilters({ filters, onChange }: MapFiltersProps) {
  return (
    <div className="space-y-4">
      <FilterGroup
        label="Hazard"
        options={HAZARD_TYPES}
        labels={HAZARD_TYPE_LABEL}
        active={filters.hazard_type}
        onToggle={(value) =>
          onChange({ ...filters, hazard_type: toggle(filters.hazard_type, value) })
        }
      />
      <FilterGroup
        label="Severity"
        options={SEVERITIES}
        labels={SEVERITY_LABEL}
        active={filters.severity}
        onToggle={(value) =>
          onChange({ ...filters, severity: toggle(filters.severity, value) })
        }
      />
      <FilterGroup
        label="Status"
        options={STATUSES}
        labels={STATUS_LABEL}
        active={filters.status}
        onToggle={(value) => onChange({ ...filters, status: toggle(filters.status, value) })}
      />
    </div>
  );
}
