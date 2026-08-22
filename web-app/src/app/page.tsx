import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { ProblemSection } from "@/components/landing/ProblemSection";

export default function LandingPage() {
  return (
    <div className="mx-auto max-w-6xl px-6">
      <Hero />
      <ProblemSection />
      <HowItWorks />
    </div>
  );
}
