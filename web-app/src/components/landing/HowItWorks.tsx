const LOOP = [
  "See",
  "Understand",
  "Locate",
  "Check",
  "Prioritize",
  "Route",
  "Act",
];

export function HowItWorks() {
  return (
    <section className="py-16 text-center">
      <p className="mb-6 text-sm font-medium uppercase tracking-wide text-rw-brand-start">
        How it works
      </p>
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-3">
        {LOOP.map((step, index) => (
          <div key={step} className="flex items-center gap-3">
            <span className="rounded-full bg-gradient-to-r from-rw-brand-start to-rw-brand-end px-4 py-2 text-sm font-medium text-white">
              {step}
            </span>
            {index < LOOP.length - 1 && (
              <span className="text-rw-text-muted">→</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
