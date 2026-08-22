import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Counter, Rise, SceneShell, useEnter } from "../components/base";
import { LANDSCAPE, MARKET, STORM, VALUE } from "../data";
import { MONO } from "../font";
import { BRAND_GRADIENT, C } from "../theme";


const DarkEyebrow: React.FC<{ children: React.ReactNode; delay?: number }> = ({
  children,
  delay = 0,
}) => (
  <Rise delay={delay}>
    <div
      style={{
        fontSize: 21,
        fontWeight: 700,
        letterSpacing: 3.4,
        textTransform: "uppercase",
        color: C.brandEnd,
      }}
    >
      {children}
    </div>
  </Rise>
);

const DarkHead: React.FC<{ children: React.ReactNode; delay?: number; size?: number }> = ({
  children,
  delay = 0,
  size = 64,
}) => (
  <Rise delay={delay}>
    <h1
      style={{
        fontSize: size,
        lineHeight: 1.08,
        fontWeight: 700,
        letterSpacing: -2,
        margin: 0,
        color: C.inkText,
      }}
    >
      {children}
    </h1>
  </Rise>
);

const DarkSub: React.FC<{ children: React.ReactNode; delay?: number; size?: number }> = ({
  children,
  delay = 0,
  size = 29,
}) => (
  <Rise delay={delay}>
    <p style={{ fontSize: size, lineHeight: 1.5, margin: 0, maxWidth: 1180, color: C.inkMuted }}>
      {children}
    </p>
  </Rise>
);

/** Divider card announcing the market act. */
export const MarketIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const line = useEnter(10);
  return (
    <SceneShell dark>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: 120,
        }}
      >
        <DarkEyebrow>After the demo</DarkEyebrow>
        <div style={{ height: 30 }} />
        <DarkHead delay={8} size={92}>
          Who buys this,
          <br />
          and for how much?
        </DarkHead>
        <div style={{ height: 44 }} />
        <div
          style={{
            height: 6,
            width: 220 * line,
            borderRadius: 999,
            background: BRAND_GRADIENT,
          }}
        />
        <div style={{ height: 44 }} />
        <DarkSub delay={26} size={30}>
          Market, operations and pricing analysis run on the Calafai platform.
          Bottom-up, source-graded, and deliberately smaller than the number we could
          have quoted.
        </DarkSub>
      </AbsoluteFill>
    </SceneShell>
  );
};

/* --------------------------------------------------------------- positioning */

const Dot: React.FC<{
  x: number;
  y: number;
  label: string;
  note: string;
  index: number;
}> = ({ x, y, label, note, index }) => {
  const p = useEnter(20 + index * 7, 24);
  return (
    <div
      style={{
        position: "absolute",
        left: `${x * 100}%`,
        bottom: `${y * 100}%`,
        transform: `translate(-50%, 50%) scale(${p})`,
        opacity: p,
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div
        style={{
          width: 17,
          height: 17,
          borderRadius: 999,
          background: C.inkMuted,
          flexShrink: 0,
        }}
      />
      <div style={{ whiteSpace: "nowrap" }}>
        <div style={{ fontSize: 22, fontWeight: 600, color: C.inkText }}>{label}</div>
        <div style={{ fontSize: 18, color: C.inkMuted }}>{note}</div>
      </div>
    </div>
  );
};

/** The gap: fast without routing, or routed without detection. Never both. */
export const MarketWedge: React.FC = () => {
  const us = useEnter(66, 18);
  return (
    <SceneShell dark>
      <AbsoluteFill style={{ padding: "60px 110px", justifyContent: "center" }}>
        <DarkEyebrow>The wedge</DarkEyebrow>
        <div style={{ height: 18 }} />
        <DarkHead delay={6} size={58}>
          Detection is commoditising. The <span style={{ color: C.brandEnd }}>action layer</span> is
          the product.
        </DarkHead>
        <div style={{ height: 44 }} />

        <div style={{ display: "flex", gap: 72, alignItems: "center" }}>
          {/* the 2x2 */}
          <div
            style={{
              position: "relative",
              width: 830,
              height: 470,
              borderLeft: `2px solid ${C.inkBorder}`,
              borderBottom: `2px solid ${C.inkBorder}`,
              flexShrink: 0,
              marginLeft: 34,
            }}
          >
            {LANDSCAPE.map((p, i) => (
              <Dot
                key={p.player}
                x={p.routed}
                y={p.fresh}
                label={p.player}
                note={p.note}
                index={i}
              />
            ))}

            {/* Roadar, upper right */}
            <div
              style={{
                position: "absolute",
                left: "88%",
                bottom: "88%",
                transform: `translate(-50%, 50%) scale(${us})`,
                opacity: us,
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 999,
                  background: BRAND_GRADIENT,
                  boxShadow: `0 0 0 10px rgba(250,80,15,0.18)`,
                  flexShrink: 0,
                }}
              />
              <div
                style={{
                  fontSize: 30,
                  fontWeight: 700,
                  color: C.inkText,
                  whiteSpace: "nowrap",
                }}
              >
                Roadar
              </div>
            </div>

            {/* axis labels */}
            <div
              style={{
                position: "absolute",
                bottom: -44,
                right: 0,
                fontSize: 20,
                color: C.inkMuted,
              }}
            >
              Toward municipal action &rarr;
            </div>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: -34,
                height: "100%",
                display: "flex",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: 20,
                  color: C.inkMuted,
                  whiteSpace: "nowrap",
                  transform: "rotate(-90deg)",
                }}
              >
                Freshness
              </span>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <Rise delay={80}>
              <div
                style={{
                  borderLeft: `4px solid ${C.brandStart}`,
                  paddingLeft: 26,
                  fontSize: 31,
                  lineHeight: 1.45,
                  color: C.inkText,
                  fontWeight: 500,
                }}
              >
                Every incumbent is either <em>fast without routing</em> or{" "}
                <em>routed without detection</em>.
              </div>
            </Rise>
            <div style={{ height: 30 }} />
            <DarkSub delay={92} size={25}>
              April 2026: Waymo and Waze pushed ~500 potholes to five US metros, free. Cities
              asked for it. What they got was a pin on a map — no dedupe, no severity, no
              department. That layer is still open.
            </DarkSub>
          </div>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

/* --------------------------------------------------------------- storm week */

/** The killer fact: the desk breaks exactly when the city needs it most. */
export const MarketStorm: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const barW = (v: number) => v / STORM.withRoadwatch;
  const grow = interpolate(frame, [18, 44], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const rows = [
    { label: "One coordinator, by hand", value: STORM.manualLimit, color: C.inkBorder, note: "12 min per event" },
    { label: "A storm week delivers", value: STORM.stormArrivals, color: C.critical, note: "≈3.2× calm volume" },
    { label: "With Roadar", value: STORM.withRoadwatch, color: C.brandStart, note: "2 min per event", grad: true },
  ];

  return (
    <SceneShell dark>
      <AbsoluteFill style={{ padding: "0 110px", justifyContent: "center" }}>
        <DarkEyebrow>The operations case</DarkEyebrow>
        <div style={{ height: 18 }} />
        <DarkHead delay={6} size={60}>
          The manual desk breaks <span style={{ color: C.brandEnd }}>on the worst day</span>.
        </DarkHead>
        <div style={{ height: 20 }} />
        <DarkSub delay={12} size={27}>
          Unique hazard events per day a pop-250k city can actually triage.
        </DarkSub>
        <div style={{ height: 56 }} />

        <div style={{ display: "flex", flexDirection: "column", gap: 34 }}>
          {rows.map((r, i) => (
            <div key={r.label} style={{ display: "flex", alignItems: "center", gap: 30 }}>
              <div style={{ width: 460, flexShrink: 0, textAlign: "right" }}>
                <div style={{ fontSize: 28, fontWeight: 600, color: C.inkText }}>{r.label}</div>
                <div style={{ fontSize: 20, color: C.inkMuted, marginTop: 4 }}>{r.note}</div>
              </div>
              <div style={{ flex: 1, height: 62, position: "relative" }}>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(255,255,255,0.04)",
                    borderRadius: 10,
                  }}
                />
                <div
                  style={{
                    width: `${barW(r.value) * 100 * grow}%`,
                    height: "100%",
                    borderRadius: 10,
                    background: r.grad ? BRAND_GRADIENT : r.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    paddingRight: 20,
                  }}
                >
                  <span
                    style={{
                      fontFamily: MONO,
                      fontSize: 30,
                      fontWeight: 700,
                      color: r.grad || r.color === C.critical ? "#fff" : C.inkText,
                    }}
                  >
                    <Counter to={r.value} delay={18} duration={26} decimals={r.value % 1 ? 1 : 0} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ height: 60 }} />
        <div style={{ display: "flex", gap: 26 }}>
          <Rise delay={58} style={{ flex: 1 }}>
            <div
              style={{
                background: C.inkSoft,
                border: `1px solid ${C.inkBorder}`,
                borderRadius: 20,
                padding: 30,
              }}
            >
              <div style={{ fontSize: 27, lineHeight: 1.45, color: C.inkText }}>
                A storm week demands{" "}
                <strong style={{ color: C.brandEnd }}>4.5 hours</strong> of manual triage against a{" "}
                <strong style={{ color: C.brandEnd }}>2.5-hour</strong> window.
              </div>
            </div>
          </Rise>
          <Rise delay={68} style={{ flex: 1 }}>
            <div
              style={{
                background: C.inkSoft,
                border: `1px solid ${C.inkBorder}`,
                borderRadius: 20,
                padding: 30,
              }}
            >
              <div style={{ fontSize: 27, lineHeight: 1.45, color: C.inkText }}>
                <strong style={{ color: C.brandEnd }}>
                  <Counter to={STORM.hoursReturned} delay={68} duration={22} />
                </strong>{" "}
                coordinator hours returned per year — triage plus shift handoff.
              </div>
            </div>
          </Rise>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

/* -------------------------------------------------------------- market size */

/** The honest number, and the two numbers we refuse to quote. */
export const MarketSize: React.FC = () => {
  const frame = useCurrentFrame();
  const strike = interpolate(frame, [50, 66], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const tiers = [
    { label: "US market · TAM", value: MARKET.tam, w: 1, big: true },
    { label: "Serviceable today · SAM", value: MARKET.sam, w: 0.45 },
    { label: "3-year beachhead · SOM", value: MARKET.som, w: 0.06 },
  ];

  return (
    <SceneShell dark>
      <AbsoluteFill style={{ padding: "0 110px", justifyContent: "center" }}>
        <DarkEyebrow>The market</DarkEyebrow>
        <div style={{ height: 18 }} />
        <DarkHead delay={6} size={60}>
          We&rsquo;re pitching the <span style={{ color: C.brandEnd }}>honest</span> number.
        </DarkHead>
        <div style={{ height: 20 }} />
        <DarkSub delay={12} size={27}>
          Bottom-up from {MARKET.cityCount} US cities over 50k, urban counties and state DOTs —
          annual licence revenue, not construction budgets.
        </DarkSub>
        <div style={{ height: 52 }} />

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {tiers.map((t, i) => (
            <TierBar key={t.label} {...t} index={i} />
          ))}
        </div>

        <div style={{ height: 56 }} />

        <Rise delay={46}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 30,
              flexWrap: "wrap",
              fontSize: 26,
              color: C.inkMuted,
            }}
          >
            <span>Numbers we could have quoted and didn&rsquo;t:</span>
            {MARKET.notThis.map((n) => (
              <span key={n} style={{ position: "relative", color: C.inkMuted }}>
                {n}
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "52%",
                    height: 2,
                    width: `${strike * 100}%`,
                    background: C.critical,
                  }}
                />
              </span>
            ))}
          </div>
        </Rise>
        <div style={{ height: 26 }} />
        <DarkSub delay={62} size={26}>
          A bounded number that survives diligence beats a trillion-dollar hand wave. Venture
          scale lives in the longitudinal road-condition data layer, not the licence line.
        </DarkSub>
      </AbsoluteFill>
    </SceneShell>
  );
};

const TierBar: React.FC<{
  label: string;
  value: string;
  w: number;
  big?: boolean;
  index: number;
}> = ({ label, value, w, big, index }) => {
  const frame = useCurrentFrame();
  const grow = interpolate(frame, [18 + index * 6, 42 + index * 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
      <div style={{ width: 400, flexShrink: 0, textAlign: "right", fontSize: 25, color: C.inkMuted }}>
        {label}
      </div>
      <div style={{ flex: 1, height: big ? 86 : 62, position: "relative" }}>
        <div
          style={{
            width: `${w * 100 * grow}%`,
            height: "100%",
            borderRadius: 12,
            background: big ? BRAND_GRADIENT : "rgba(255,255,255,0.11)",
            display: "flex",
            alignItems: "center",
            paddingLeft: 26,
            minWidth: 150,
          }}
        >
          <span
            style={{
              fontFamily: MONO,
              fontSize: big ? 46 : 32,
              fontWeight: 700,
              color: big ? "#fff" : C.inkText,
              opacity: grow,
            }}
          >
            {value}
          </span>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------- pricing */

/** Value-ceiling pricing: quantify the value, then price visibly beneath it. */
export const MarketValue: React.FC = () => {
  const frame = useCurrentFrame();
  const total = VALUE.components.reduce((a, b) => a + b.value, 0);

  return (
    <SceneShell dark>
      <AbsoluteFill style={{ padding: "0 110px", justifyContent: "center" }}>
        <DarkEyebrow>The economics</DarkEyebrow>
        <div style={{ height: 18 }} />
        <DarkHead delay={6} size={60}>
          A pop-250k city buys about{" "}
          <span style={{ color: C.brandEnd }}>$68K</span> of value a year.
        </DarkHead>
        <div style={{ height: 48 }} />

        <div style={{ display: "flex", gap: 60, alignItems: "center" }}>
          <div style={{ flex: 1 }}>
            {VALUE.components.map((c, i) => (
              <ValueRow key={c.label} label={c.label} value={c.value} max={total} index={i} />
            ))}
            <Rise delay={54}>
              <div
                style={{
                  marginTop: 10,
                  fontSize: 21,
                  lineHeight: 1.45,
                  color: C.inkMuted,
                  borderLeft: `3px solid ${C.critical}`,
                  paddingLeft: 18,
                }}
              >
                Claims posture is the largest component and the least certain — it swings the
                ceiling from $43K to $120K. Operations value alone is about $30K, so we validate
                claims with a city risk office before quoting.
              </div>
            </Rise>
          </div>

          <div style={{ width: 620, flexShrink: 0 }}>
            <Rise delay={44}>
              <div
                style={{
                  background: C.inkSoft,
                  border: `1px solid ${C.inkBorder}`,
                  borderRadius: 24,
                  padding: 40,
                }}
              >
                <Line label="Annual value to the city" value="$67.9K" delay={44} />
                <div style={{ height: 22 }} />
                <Line label="Roadar licence" value="$36K" delay={54} accent />
                <div
                  style={{
                    height: 1,
                    background: C.inkBorder,
                    margin: "26px 0",
                  }}
                />
                <Line label="What the city visibly keeps" value="$31.9K" delay={64} big />
                <div style={{ height: 26 }} />
                <div style={{ fontSize: 22, color: C.inkMuted, lineHeight: 1.45 }}>
                  53% capture ratio. Pilot at $12K a quarter, per-report capped — small enough
                  for discretionary approval.
                </div>
              </div>
            </Rise>
          </div>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

const ValueRow: React.FC<{ label: string; value: number; max: number; index: number }> = ({
  label,
  value,
  max,
  index,
}) => {
  const frame = useCurrentFrame();
  const grow = interpolate(frame, [16 + index * 7, 40 + index * 7], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div style={{ marginBottom: 30 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 24,
          color: C.inkText,
          marginBottom: 11,
        }}
      >
        <span>{label}</span>
        <span style={{ fontFamily: MONO, color: C.brandEnd, fontWeight: 700 }}>
          $<Counter to={value} delay={16 + index * 7} duration={24} decimals={1} />K
        </span>
      </div>
      <div style={{ height: 14, background: "rgba(255,255,255,0.06)", borderRadius: 999 }}>
        <div
          style={{
            width: `${(value / max) * 100 * grow}%`,
            height: "100%",
            borderRadius: 999,
            background: BRAND_GRADIENT,
          }}
        />
      </div>
    </div>
  );
};

const Line: React.FC<{
  label: string;
  value: string;
  delay: number;
  accent?: boolean;
  big?: boolean;
}> = ({ label, value, delay, accent, big }) => {
  const p = useEnter(delay, 24);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        opacity: p,
      }}
    >
      <span style={{ fontSize: 24, color: C.inkMuted }}>{label}</span>
      <span
        style={{
          fontFamily: MONO,
          fontSize: big ? 52 : 38,
          fontWeight: 700,
          color: big || accent ? C.brandEnd : C.inkText,
        }}
      >
        {value}
      </span>
    </div>
  );
};

/* ------------------------------------------------------------------ privacy */

/** Stated before anyone asks — the deck's own instruction. */
export const MarketPrivacy: React.FC = () => (
  <SceneShell dark>
    <AbsoluteFill style={{ padding: "0 130px", justifyContent: "center" }}>
      <DarkEyebrow>Stated before you ask</DarkEyebrow>
      <div style={{ height: 18 }} />
      <DarkHead delay={6} size={62}>
        This is an <span style={{ color: C.brandEnd }}>infrastructure</span> camera,
        <br />
        not a surveillance camera.
      </DarkHead>
      <div style={{ height: 56 }} />
      <div style={{ display: "flex", gap: 26 }}>
        {[
          {
            t: "No person identification",
            d: "Nowhere in the pipeline. The models are asked about pavement, debris, lanes and water.",
          },
          {
            t: "City-owned lenses first",
            d: "Municipal fleet dashcams and existing traffic cameras — then AV feeds, never consumer-owned cars.",
          },
          {
            t: "Maintenance purpose only",
            d: "Roadar never contacts emergency services. Collisions are flagged for human review and stop there.",
          },
        ].map((c, i) => (
          <Rise key={c.t} delay={18 + i * 10} style={{ flex: 1 }}>
            <div
              style={{
                background: C.inkSoft,
                border: `1px solid ${C.inkBorder}`,
                borderRadius: 22,
                padding: 34,
                height: "100%",
              }}
            >
              <div style={{ fontSize: 29, fontWeight: 700, color: C.inkText, lineHeight: 1.25 }}>
                {c.t}
              </div>
              <div style={{ height: 18 }} />
              <div style={{ fontSize: 23, lineHeight: 1.5, color: C.inkMuted }}>{c.d}</div>
            </div>
          </Rise>
        ))}
      </div>
      <div style={{ height: 50 }} />
      <DarkSub delay={56} size={27}>
        We&rsquo;re pitching a camera product in San Francisco. Saying this first is part of the
        product.
      </DarkSub>
    </AbsoluteFill>
  </SceneShell>
);
