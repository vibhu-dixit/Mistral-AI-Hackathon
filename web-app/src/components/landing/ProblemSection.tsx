import { Card } from "@/components/ui/Card";

const STEPS = ["Seeing", "Identifying", "Categorizing", "Reporting", "Tracking"];

export function ProblemSection() {
  return (
    <section className="py-16">
      <Card className="mx-auto max-w-3xl space-y-4 text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-rw-brand-start">
          The problem
        </p>
        <p className="text-lg text-rw-text">
          Cities can&rsquo;t inspect every road continuously. Today, reporting
          depends on someone:
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-rw-text-muted">
          {STEPS.map((step, index) => (
            <span key={step} className="flex items-center gap-2">
              <span className="rounded-full border border-rw-border px-3 py-1">{step}</span>
              {index < STEPS.length - 1 && <span>→</span>}
            </span>
          ))}
        </div>
        <p className="text-rw-text-muted">
          Most cameras already see these hazards. They just don&rsquo;t
          understand them.
        </p>
      </Card>
    </section>
  );
}
