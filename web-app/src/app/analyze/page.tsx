"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { HazardCard } from "@/components/hazard/HazardCard";
import { AnalysisProgress } from "@/components/upload/AnalysisProgress";
import { CameraCaptureButton } from "@/components/upload/CameraCaptureButton";
import { LocationStatus } from "@/components/upload/LocationStatus";
import { MediaPreview } from "@/components/upload/MediaPreview";
import { UploadDropzone } from "@/components/upload/UploadDropzone";
import { Button } from "@/components/ui/Button";
import { useAnalyzeUpload } from "@/hooks/useAnalyzeUpload";
import { useGeolocation } from "@/hooks/useGeolocation";

export default function AnalyzePage() {
  const [selected, setSelected] = useState<{ file: File; kind: "image" | "video" } | null>(
    null,
  );
  const { analyze, isPending, isSuccess, error, data, stageIndex, stages, reset } =
    useAnalyzeUpload();
  const geolocation = useGeolocation();

  function handleFileSelected(file: File, kind: "image" | "video") {
    reset();
    setSelected({ file, kind });
    geolocation.request();
  }

  const highlightIds = data?.hazards.map((hazard) => hazard.id).join(",") ?? "";

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-6 py-16">
      <div>
        <h1 className="text-2xl font-semibold text-rw-text">Analyze a drive</h1>
        <p className="mt-1 text-rw-text-muted">
          Take a street photo. Mistral classifies it, checks nearby reports, and writes a municipal finding.
        </p>
      </div>

      {!selected && (
        <div className="space-y-4">
          <CameraCaptureButton onCapture={(file) => handleFileSelected(file, "image")} />
          <div className="flex items-center gap-3 text-xs text-rw-text-muted">
            <span className="h-px flex-1 bg-rw-border" />
            or upload existing footage
            <span className="h-px flex-1 bg-rw-border" />
          </div>
          <UploadDropzone onFileSelected={handleFileSelected} />
        </div>
      )}

      {selected && !isPending && !isSuccess && (
        <div className="space-y-4">
          <MediaPreview file={selected.file} kind={selected.kind} />
          <LocationStatus status={geolocation.status} coords={geolocation.coords} />
          <div className="flex gap-3">
            <Button
              onClick={() =>
                analyze({
                  file: selected.file,
                  kind: selected.kind,
                  coords: geolocation.coords ?? undefined,
                })
              }
              disabled={geolocation.status === "requesting"}
            >
              {geolocation.status === "requesting" ? "Getting location..." : "Analyze Drive"}
            </Button>
            <Button variant="secondary" onClick={() => setSelected(null)}>
              Choose a different file
            </Button>
          </div>
          {error && <p className="text-sm text-rw-severity-critical">{error.message}</p>}
        </div>
      )}

      {selected && (isPending || isSuccess) && (
        <AnalysisProgress stages={stages} stageIndex={stageIndex} isSuccess={isSuccess} data={data} />
      )}

      {isSuccess && data && (
        <div className="space-y-3">
          {data.hazards.map((hazard) => (
            <HazardCard key={hazard.id} hazard={hazard} />
          ))}
          {data.persist_error ? (
            <p className="text-sm text-rw-severity-critical">{data.persist_error}</p>
          ) : null}
          {data.hazards.length > 0 ? (
            <Link href={`/?highlight=${highlightIds}`}>
              <Button className="w-full justify-center">
                View on map
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          ) : null}
        </div>
      )}
    </div>
  );
}
