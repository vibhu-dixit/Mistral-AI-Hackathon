import { Suspense } from "react";

import { DashboardContent } from "@/components/dashboard/DashboardContent";

export default function HomePage() {
  return (
    <Suspense fallback={<div className="p-6 text-rw-text-muted">Loading map…</div>}>
      <DashboardContent />
    </Suspense>
  );
}
