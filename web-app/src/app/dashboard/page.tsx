import { Suspense } from "react";

import { DashboardContent } from "./DashboardContent";

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-6 text-rw-text-muted">Loading map…</div>}>
      <DashboardContent />
    </Suspense>
  );
}
