import type { HazardStatus, Severity } from "@/lib/types";

/** Single source of truth mapping severity/status -> the CSS color tokens in globals.css. */
export const SEVERITY_COLOR: Record<Severity, string> = {
  routine: "var(--rw-severity-routine)",
  urgent: "var(--rw-severity-urgent)",
  critical: "var(--rw-severity-critical)",
};

export const STATUS_COLOR: Record<HazardStatus, string> = {
  detected: "var(--rw-status-detected)",
  report_ready: "var(--rw-status-report-ready)",
  reported: "var(--rw-status-reported)",
  in_progress: "var(--rw-status-in-progress)",
  resolved: "var(--rw-status-resolved)",
};
