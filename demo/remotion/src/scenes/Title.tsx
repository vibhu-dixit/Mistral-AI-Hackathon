import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Grad, Rise, SceneShell, useEnter } from "../components/base";
import { BRAND_GRADIENT, C } from "../theme";

/** Opening card. Mirrors the product's own hero copy. */
export const Title: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const badge = useEnter(0);
  const glow = interpolate(frame, [0, 3 * fps], [0.35, 0.85], { extrapolateRight: "clamp" });

  return (
    <SceneShell>
      {/* soft brand wash behind the wordmark */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(52% 44% at 50% 42%, rgba(250,80,15,${
            0.13 * glow
          }) 0%, rgba(254,198,58,0) 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: 90,
        }}
      >
        <div
          style={{
            opacity: badge,
            transform: `translateY(${interpolate(badge, [0, 1], [20, 0])}px)`,
            border: `1px solid ${C.border}`,
            background: C.surface,
            borderRadius: 999,
            padding: "11px 26px",
            fontSize: 22,
            color: C.muted,
            fontWeight: 500,
            marginBottom: 44,
          }}
        >
          Mistral AI Hackathon
        </div>

        <Rise delay={8}>
          <div style={{ fontSize: 128, fontWeight: 700, letterSpacing: -5, lineHeight: 1 }}>
            RoadWatch
          </div>
        </Rise>

        <Rise delay={20} style={{ marginTop: 30 }}>
          <div
            style={{
              fontSize: 58,
              fontWeight: 700,
              letterSpacing: -1.8,
              lineHeight: 1.14,
              maxWidth: 1320,
            }}
          >
            Turn every camera into an <Grad>autonomous road inspector</Grad>.
          </div>
        </Rise>

        <Rise delay={34} style={{ marginTop: 34 }}>
          <div style={{ fontSize: 29, color: C.muted, maxWidth: 1000, lineHeight: 1.5 }}>
            One street photo in. A deduplicated, severity-scored, department-routed
            municipal report out.
          </div>
        </Rise>

        <Rise delay={48} style={{ marginTop: 52 }}>
          <div style={{ height: 6, width: 190, borderRadius: 999, background: BRAND_GRADIENT }} />
        </Rise>
      </AbsoluteFill>
    </SceneShell>
  );
};
