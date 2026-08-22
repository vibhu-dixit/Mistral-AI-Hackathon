"use client";

import { ChangeEvent, FormEvent, useState } from "react";

type Observation = {
  id: string;
  asset_name: string;
  coordinates: { latitude: number; longitude: number } | null;
  location_source: string;
  location_confidence: number;
  hazard_type: string | null;
  severity: string | null;
  confidence: number | null;
  description: string | null;
  processing_status: string;
  generated_report?: string | null;
  duplicate?: boolean;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8010";

async function readDeviceCoordinates(): Promise<{ latitude: number; longitude: number } | null> {
  if (!navigator.geolocation) return null;
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => resolve({ latitude: position.coords.latitude, longitude: position.coords.longitude }),
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 4000 }
    );
  });
}

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [observation, setObservation] = useState<Observation | null>(null);
  const [status, setStatus] = useState("Ready for an image");
  const [error, setError] = useState("");

  function chooseImage(event: ChangeEvent<HTMLInputElement>) {
    setImage(event.target.files?.[0] ?? null);
    setObservation(null);
    setError("");
    setStatus(event.target.files?.[0] ? "Image ready to analyze" : "Ready for an image");
  }

  async function analyze(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!image) return;

    setStatus("Reading location and scanning image...");
    setError("");
    const formData = new FormData();
    formData.append("image", image);
    const coords = await readDeviceCoordinates();
    if (coords) {
      formData.append("client_lat", String(coords.latitude));
      formData.append("client_lng", String(coords.longitude));
    }

    try {
      const response = await fetch(`${API_URL}/api/observations`, { method: "POST", body: formData });
      if (!response.ok) throw new Error("The observation could not be processed.");
      const result = (await response.json()) as Observation;
      setObservation(result);
      setStatus("Observation ready for routing");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Request failed.");
      setStatus("Processing failed");
    }
  }

  return (
    <main>
      <header className="topbar">
        <span className="brand">ROADWATCH</span>
        <span className="signal">IMAGE OBSERVATION PIPELINE</span>
      </header>
      <section className="hero">
        <p className="eyebrow">Capture. Understand. Route.</p>
        <h1>Turn a road image into a municipal finding.</h1>
        <p className="lede">
          RoadWatch extracts trusted location evidence, asks Mistral what is happening, and stores a structured
          observation for the next agent.
        </p>
      </section>
      <section className="workspace">
        <form className="upload-panel" onSubmit={analyze}>
          <div>
            <p className="eyebrow">01 / INPUT</p>
            <h2>Upload evidence</h2>
            <p>EXIF GPS is preferred. Device coordinates are sent when the browser allows it.</p>
          </div>
          <label className="dropzone">
            <input type="file" accept="image/*" capture="environment" onChange={chooseImage} />
            {image ? (
              <>
                <strong>{image.name}</strong>
                <span>Ready for analysis</span>
              </>
            ) : (
              <>
                <strong>Select a road image</strong>
                <span>Camera or file upload</span>
              </>
            )}
          </label>
          <button type="submit" disabled={!image || status.includes("scanning")}>
            {status.includes("scanning") ? "Analyzing..." : "Analyze image"}
          </button>
          <p className="status">{status}</p>
          {error && <p className="error">{error}</p>}
        </form>
        <section className="result-panel">
          <div>
            <p className="eyebrow">02 / FINDING</p>
            <h2>Structured output</h2>
          </div>
          {observation ? (
            <div className="finding">
              <div className="finding-head">
                <span className={`severity ${observation.severity}`}>{observation.severity}</span>
                <strong>{observation.hazard_type}</strong>
              </div>
              <p className="description">{observation.description}</p>
              {observation.generated_report ? <p className="description">{observation.generated_report}</p> : null}
              <dl>
                <div>
                  <dt>Coordinates</dt>
                  <dd>
                    {observation.coordinates
                      ? `${observation.coordinates.latitude.toFixed(5)}, ${observation.coordinates.longitude.toFixed(5)}`
                      : "Unavailable"}
                  </dd>
                </div>
                <div>
                  <dt>Location source</dt>
                  <dd>
                    {observation.location_source} · {Math.round(observation.location_confidence * 100)}%
                  </dd>
                </div>
                <div>
                  <dt>Model confidence</dt>
                  <dd>{observation.confidence ? `${Math.round(observation.confidence * 100)}%` : "Pending"}</dd>
                </div>
                <div>
                  <dt>Duplicate</dt>
                  <dd>{observation.duplicate ? "Possible match nearby" : "No"}</dd>
                </div>
                <div>
                  <dt>Processing</dt>
                  <dd>{observation.processing_status}</dd>
                </div>
              </dl>
              <div className="handoff">
                Saved observation ID
                <br />
                <code>{observation.id}</code>
              </div>
            </div>
          ) : (
            <div className="empty">
              <span>Awaiting an image</span>
              <p>The finding, coordinates, and evidence source will appear here for the routing agent.</p>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
