import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FONT, MONO } from "../font";
import { C } from "../theme";
import { useEnter } from "./base";

/** Phone bezel around a mobile-web screenshot. */
export const Phone: React.FC<{
  src: string;
  delay?: number;
  height?: number;
  /** 0 = top of the screenshot, 1 = bottom. Pans a tall capture. */
  pan?: number;
  style?: React.CSSProperties;
}> = ({ src, delay = 0, height = 800, pan = 0, style }) => {
  const p = useEnter(delay);
  const width = height * (430 / 932);
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 46,
        background: "#0b0b0e",
        padding: 11,
        boxShadow: "0 40px 90px rgba(23,23,28,0.22)",
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px) scale(${interpolate(p, [0, 1], [0.96, 1])})`,
        flexShrink: 0,
        ...style,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 36,
          overflow: "hidden",
          background: C.bg,
          position: "relative",
        }}
      >
        <Img
          src={staticFile(src)}
          style={{
            width: "100%",
            position: "absolute",
            top: 0,
            transform: `translateY(${-pan * 100}%)`,
          }}
        />
      </div>
    </div>
  );
};

/** Browser window chrome around a desktop screenshot. */
export const Browser: React.FC<{
  src: string;
  delay?: number;
  width?: number;
  url?: string;
  /** Crop to the top N fraction of a full-page capture. */
  crop?: number;
  scale?: number;
  style?: React.CSSProperties;
}> = ({ src, delay = 0, width = 1180, url = "localhost:3000", crop, scale = 1, style }) => {
  const p = useEnter(delay);
  const bodyHeight = (width * 900) / 1440;
  return (
    <div
      style={{
        width,
        borderRadius: 16,
        overflow: "hidden",
        border: `1px solid ${C.border}`,
        background: C.surface,
        boxShadow: "0 34px 80px rgba(23,23,28,0.18)",
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [36, 0])}px) scale(${
          scale * interpolate(p, [0, 1], [0.97, 1])
        })`,
        ...style,
      }}
    >
      <div
        style={{
          height: 44,
          background: "#f1efe9",
          borderBottom: `1px solid ${C.border}`,
          display: "flex",
          alignItems: "center",
          paddingLeft: 18,
          gap: 9,
        }}
      >
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <span key={c} style={{ width: 12, height: 12, borderRadius: 999, background: c }} />
        ))}
        <div
          style={{
            marginLeft: 18,
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 999,
            padding: "5px 20px",
            fontSize: 15,
            color: C.muted,
            fontFamily: MONO,
          }}
        >
          {url}
        </div>
      </div>
      <div style={{ height: crop ? bodyHeight : "auto", overflow: "hidden", background: C.bg }}>
        <Img src={staticFile(src)} style={{ width: "100%", display: "block" }} />
      </div>
    </div>
  );
};

/** A raw photo tile — the input side of the pipeline. */
export const Photo: React.FC<{
  src: string;
  delay?: number;
  width?: number;
  height?: number;
  label?: string;
  style?: React.CSSProperties;
}> = ({ src, delay = 0, width = 460, height = 320, label, style }) => {
  const p = useEnter(delay);
  return (
    <div
      style={{
        opacity: p,
        transform: `scale(${interpolate(p, [0, 1], [0.94, 1])})`,
        ...style,
      }}
    >
      <div
        style={{
          width,
          height,
          borderRadius: 18,
          overflow: "hidden",
          border: `1px solid ${C.border}`,
          background: "#000",
        }}
      >
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      {label ? (
        <div
          style={{
            marginTop: 12,
            fontSize: 18,
            color: C.muted,
            fontFamily: MONO,
          }}
        >
          {label}
        </div>
      ) : null}
    </div>
  );
};

/** Corner watermark that persists across the whole video. */
export const Watermark: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        bottom: 38,
        right: 52,
        fontFamily: FONT,
        fontSize: 19,
        fontWeight: 600,
        letterSpacing: 0.4,
        color: C.muted,
        opacity: o * 0.75,
      }}
    >
      RoadWatch · Mistral AI Hackathon
    </div>
  );
};
