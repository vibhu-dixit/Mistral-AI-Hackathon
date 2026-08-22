export function ConfidenceMeter({ confidence }: { confidence: number }) {
  const percent = Math.round(confidence * 100);

  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs text-rw-text-muted">
        <span>Confidence</span>
        <span>{percent}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-rw-border">
        <div
          className="h-full rounded-full bg-gradient-to-r from-rw-brand-start to-rw-brand-end"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
