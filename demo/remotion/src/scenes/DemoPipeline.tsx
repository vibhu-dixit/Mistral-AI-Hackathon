import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Counter, Eyebrow, Grad, Headline, Rise, SceneShell, useEnter } from "../components/base";
import { Photo } from "../components/Frames";
import { PIPELINE, PIPELINE_TOTAL_MS } from "../data";
import { MONO } from "../font";
import { BRAND_GRADIENT, C } from "../theme";


/** Frames each stage lights up on. Paced so the whole trace lands in ~9s. */
const STAGE_AT = [20, 40, 58, 74, 92, 112];
const DONE_AT = 134;

const StageRow: React.FC<{
  index: number;
  name: string;
  label: string;
  model: string;
  ms: number;
  /** ms share of the total, for the bar width */
  share: number;
}> = ({ index, name, label, model, ms, share }) => {
  const frame = useCurrentFrame();
  const start = STAGE_AT[index];
  const p = useEnter(start, 20);
  // the bar fills over ~14 frames once the stage starts
  const fill = interpolate(frame, [start + 4, start + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const done = frame > start + 18;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 26,
        opacity: interpolate(p, [0, 1], [0.12, 1]),
        transform: `translateX(${interpolate(p, [0, 1], [-22, 0])}px)`,
      }}
    >
      {/* status dot */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 999,
          flexShrink: 0,
          background: done ? BRAND_GRADIENT : C.border,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: 21,
          fontWeight: 700,
        }}
      >
        {done ? "✓" : index + 1}
      </div>

      {/* stage name */}
      <div style={{ width: 132, flexShrink: 0 }}>
        <div style={{ fontFamily: MONO, fontSize: 27, fontWeight: 700, letterSpacing: 1 }}>
          {name}
        </div>
      </div>

      {/* human label */}
      <div style={{ width: 300, flexShrink: 0, fontSize: 24, color: C.text }}>{label}</div>

      {/* timing bar */}
      <div style={{ flex: 1, height: 16, background: "#eeebe3", borderRadius: 999 }}>
        <div
          style={{
            width: `${share * 100 * fill}%`,
            height: "100%",
            borderRadius: 999,
            background: BRAND_GRADIENT,
          }}
        />
      </div>

      {/* model + ms */}
      <div style={{ width: 330, flexShrink: 0, textAlign: "right" }}>
        <div style={{ fontFamily: MONO, fontSize: 20, color: C.muted }}>{model}</div>
        <div style={{ fontFamily: MONO, fontSize: 25, fontWeight: 700, color: C.brandStart }}>
          {done ? `${ms} ms` : "…"}
        </div>
      </div>
    </div>
  );
};

/**
 * The centrepiece. This is the `pipeline` array the API actually returned for
 * imgs/IMG_5582.webp — same order, same models, same millisecond timings.
 */
export const DemoPipeline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const maxMs = Math.max(...PIPELINE.map((p) => p.ms));

  const totalShown = frame > DONE_AT;
  const totalOpacity = interpolate(frame, [DONE_AT, DONE_AT + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SceneShell>
      <AbsoluteFill style={{ padding: "70px 110px", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 44 }}>
          <div style={{ flex: 1 }}>
            <Eyebrow>Live run · POST /analyze-image</Eyebrow>
            <div style={{ height: 18 }} />
            <Headline size={62}>
              One photo. <Grad>Six steps, three models.</Grad>
            </Headline>
          </div>
          <Photo src="imgs/IMG_5582.webp" width={330} height={220} label="imgs/IMG_5582.webp" />
        </div>

        <div style={{ height: 56 }} />

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {PIPELINE.map((stage, i) => (
            <StageRow
              key={stage.name}
              index={i}
              name={stage.name}
              label={stage.label}
              model={stage.model}
              ms={stage.ms}
              share={stage.ms / maxMs}
            />
          ))}
        </div>

        <div style={{ height: 54 }} />

        {/* total */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `1px solid ${C.border}`,
            paddingTop: 34,
            opacity: totalOpacity,
          }}
        >
          <div style={{ fontSize: 30, color: C.muted }}>
            Photo &rarr; located, deduplicated, routed, contractor matched
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
            <Counter
              to={PIPELINE_TOTAL_MS / 1000}
              delay={DONE_AT}
              duration={20}
              decimals={2}
              style={{
                fontSize: 96,
                fontWeight: 700,
                letterSpacing: -3.4,
                color: C.brandStart,
                fontFamily: MONO,
              }}
            />
            <span style={{ fontSize: 46, fontWeight: 700, color: C.brandStart }}>s</span>
          </div>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};
