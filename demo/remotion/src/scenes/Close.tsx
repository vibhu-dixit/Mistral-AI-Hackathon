import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Rise, SceneShell, useEnter } from "../components/base";
import { MONO } from "../font";
import { BRAND_GRADIENT, C } from "../theme";


/** What we built, in one column, before the sign-off. */
export const Recap: React.FC = () => {
  const items = [
    { k: "Vision", v: "mistral-small-latest — hazard type, severity, lane impact, reasoning" },
    { k: "OCR", v: "mistral-ocr-latest — street-name and signage corroboration" },
    { k: "Agent", v: "mistral-small-latest — civic category, priority, municipal prose" },
    { k: "Dedupe", v: "Local hazard rows + live SF311 SODA feed" },
    { k: "Surface", v: "Mobile-web capture, public map, generated report, simulated submit" },
  ];
  return (
    <SceneShell>
      <AbsoluteFill style={{ padding: "0 130px", justifyContent: "center" }}>
        <Rise>
          <div
            style={{
              fontSize: 21,
              fontWeight: 700,
              letterSpacing: 3.4,
              textTransform: "uppercase",
              color: C.brandStart,
            }}
          >
            Built this weekend
          </div>
        </Rise>
        <div style={{ height: 22 }} />
        <Rise delay={6}>
          <h1 style={{ fontSize: 62, fontWeight: 700, letterSpacing: -2, margin: 0 }}>
            Three Mistral models, one municipal contract.
          </h1>
        </Rise>
        <div style={{ height: 54 }} />
        {items.map((it, i) => (
          <Rise key={it.k} delay={16 + i * 8}>
            <div
              style={{
                display: "flex",
                gap: 36,
                alignItems: "baseline",
                padding: "22px 0",
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              <div
                style={{
                  width: 190,
                  flexShrink: 0,
                  fontFamily: MONO,
                  fontSize: 25,
                  fontWeight: 700,
                  color: C.brandStart,
                }}
              >
                {it.k}
              </div>
              <div style={{ fontSize: 27, color: C.text }}>{it.v}</div>
            </div>
          </Rise>
        ))}
      </AbsoluteFill>
    </SceneShell>
  );
};

/** Sign-off, plus the Calafai attribution. */
export const Close: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const line = useEnter(24);
  const glow = interpolate(frame, [0, 2.5 * fps], [0.3, 1], { extrapolateRight: "clamp" });

  return (
    <SceneShell dark>
      <AbsoluteFill
        style={{
          background: `radial-gradient(54% 46% at 50% 40%, rgba(250,80,15,${
            0.2 * glow
          }) 0%, rgba(16,16,20,0) 72%)`,
        }}
      />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: 110,
        }}
      >
        <Rise>
          <div
            style={{
              fontSize: 92,
              fontWeight: 700,
              letterSpacing: -3.4,
              lineHeight: 1.06,
              color: C.inkText,
            }}
          >
            From any camera
            <br />
            to <span style={{ color: C.brandEnd }}>city action</span>.
          </div>
        </Rise>

        <div style={{ height: 40 }} />
        <div style={{ height: 6, width: 200 * line, borderRadius: 999, background: BRAND_GRADIENT }} />
        <div style={{ height: 40 }} />

        <Rise delay={34}>
          <div style={{ fontSize: 34, fontWeight: 600, color: C.inkText }}>Roadar</div>
          <div style={{ height: 12 }} />
          <div style={{ fontSize: 26, color: C.inkMuted }}>
            Mistral AI Hackathon · image-only MVP, live against a local stack
          </div>
        </Rise>

        {/* Calafai credit */}
        <div style={{ height: 76 }} />
        <Rise delay={52}>
          <div
            style={{
              border: `1px solid ${C.inkBorder}`,
              background: C.inkSoft,
              borderRadius: 22,
              padding: "30px 46px",
              maxWidth: 1120,
            }}
          >
            <div
              style={{
                fontSize: 19,
                fontWeight: 700,
                letterSpacing: 2.8,
                textTransform: "uppercase",
                color: C.brandEnd,
                marginBottom: 16,
              }}
            >
              With thanks to
            </div>
            <div style={{ fontSize: 34, fontWeight: 700, color: C.inkText, marginBottom: 14 }}>
              Calafai — calafai.ai
            </div>
            <div style={{ fontSize: 24, lineHeight: 1.5, color: C.inkMuted }}>
              The market, operations and pricing analysis in this video was produced on the
              Calafai platform, who gave us free credits to run it. Every figure carries a
              source grade in the companion report.
            </div>
          </div>
        </Rise>
      </AbsoluteFill>
    </SceneShell>
  );
};
