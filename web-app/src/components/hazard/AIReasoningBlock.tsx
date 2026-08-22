import { Sparkles } from "lucide-react";

export function AIReasoningBlock({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-rw-border bg-rw-bg p-4">
      <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-rw-accent-navy">
        <Sparkles className="h-3.5 w-3.5" />
        AI reasoning
      </div>
      <p className="text-sm leading-relaxed text-rw-text">{text}</p>
    </div>
  );
}
