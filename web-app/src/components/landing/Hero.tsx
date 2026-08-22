import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="flex flex-col items-center gap-6 py-24 text-center">
      <span className="rounded-full border border-rw-border bg-rw-surface px-3 py-1 text-xs font-medium text-rw-text-muted">
        Mistral AI Hackathon
      </span>

      <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-rw-text sm:text-5xl">
        Turn every camera into an{" "}
        <span className="bg-gradient-to-r from-rw-brand-start to-rw-brand-end bg-clip-text text-transparent">
          autonomous road inspector
        </span>
        .
      </h1>

      <p className="max-w-xl text-lg text-rw-text-muted">
        RoadWatch turns ordinary street photos and video into structured,
        prioritized, actionable infrastructure reports — powered by Mistral.
      </p>

      <Link href="/analyze">
        <Button className="text-base">
          Analyze Drive
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
    </section>
  );
}
