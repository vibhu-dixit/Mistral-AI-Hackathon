import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  Card,
  Eyebrow,
  Grad,
  Headline,
  Rise,
  Rule,
  SceneShell,
  Sub,
  useEnter,
} from "../components/base";
import { C } from "../theme";

const CHAIN = ["Seeing", "Identifying", "Categorizing", "Reporting", "Tracking"];

/** One link in the human chain. Extracted so hooks never run inside a loop body. */
const ChainLink: React.FC<{ label: string; index: number; last: boolean }> = ({
  label,
  index,
  last,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = useEnter(22 + index * 7);
  // the chain greys out from the far end — the drop-off is the point
  const decay = interpolate(frame, [3.1 * fps + index * 4, 3.6 * fps + index * 4], [1, 0.24], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <>
      <div
        style={{
          opacity: p * decay,
          transform: `translateY(${interpolate(p, [0, 1], [18, 0])}px)`,
          border: `1px solid ${C.border}`,
          background: C.surface,
          borderRadius: 999,
          padding: "18px 34px",
          fontSize: 30,
          fontWeight: 600,
        }}
      >
        {label}
      </div>
      {last ? null : <div style={{ opacity: p * decay, fontSize: 30, color: C.muted }}>&rarr;</div>}
    </>
  );
};

/** The status quo: a five-link human chain, and any broken link loses the hazard. */
export const ProblemChain: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <SceneShell>
      <AbsoluteFill style={{ padding: "0 130px", justifyContent: "center" }}>
        <Eyebrow>The problem</Eyebrow>
        <div style={{ height: 22 }} />
        <Headline size={70}>
          Cities can&rsquo;t inspect every road.
          <br />
          Today it depends on <Grad>a human doing all five</Grad>.
        </Headline>
        <div style={{ height: 30 }} />
        <Rule delay={14} width={160} />

        <div style={{ height: 62 }} />

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {CHAIN.map((label, i) => (
            <ChainLink key={label} label={label} index={i} last={i === CHAIN.length - 1} />
          ))}
        </div>

        <div style={{ height: 60 }} />
        <Sub delay={4 * fps} size={33}>
          Most cameras already see these hazards. They just don&rsquo;t understand them.
        </Sub>
      </AbsoluteFill>
    </SceneShell>
  );
};

const Stat: React.FC<{
  value: React.ReactNode;
  label: string;
  source: string;
  delay: number;
}> = ({ value, label, source, delay }) => (
  <Rise delay={delay} style={{ flex: 1 }}>
    <Card style={{ height: "100%", padding: 34 }}>
      <div
        style={{
          fontSize: 74,
          fontWeight: 700,
          letterSpacing: -2.6,
          color: C.brandStart,
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div style={{ height: 18 }} />
      <div style={{ fontSize: 25, lineHeight: 1.42, fontWeight: 500 }}>{label}</div>
      <div style={{ height: 16 }} />
      <div style={{ fontSize: 17, color: C.muted, letterSpacing: 0.2 }}>{source}</div>
    </Card>
  </Rise>
);

/** Scale of the backlog, in numbers a judge can check. */
export const ProblemScale: React.FC = () => (
  <SceneShell>
    <AbsoluteFill style={{ padding: "0 130px", justifyContent: "center" }}>
      <Eyebrow>Why it stays broken</Eyebrow>
      <div style={{ height: 22 }} />
      <Headline size={66}>The queue was never the bottleneck. Triage was.</Headline>
      <div style={{ height: 56 }} />

      <div style={{ display: "flex", gap: 26, alignItems: "stretch" }}>
        <Stat
          delay={16}
          value={
            <>
              400&ndash;600
            </>
          }
          label="Pothole requests San Francisco logs per month in dry months — roughly triple that in storm months."
          source="SF 311 volumes"
        />
        <Stat
          delay={26}
          value={<>3&ndash;8</>}
          label="Duplicate tickets one physical hazard generates when it is citizen-reported."
          source="Calafai workflow research"
        />
        <Stat
          delay={36}
          value={
            <>
              5&ndash;15<span style={{ fontSize: 40 }}> min</span>
            </>
          }
          label="Spent hand-checking each event for duplicates — the first task skipped under surge."
          source="Calafai workflow research"
        />
      </div>

      <div style={{ height: 52 }} />
      <Sub delay={50} size={31}>
        A coordinator reading a photo, guessing a street, checking for duplicates, picking a
        department, and typing a report. <strong style={{ color: C.text }}>Every single time.</strong>
      </Sub>
    </AbsoluteFill>
  </SceneShell>
);
