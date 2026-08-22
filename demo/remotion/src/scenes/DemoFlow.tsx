import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  Card,
  Counter,
  Eyebrow,
  Grad,
  Headline,
  Pill,
  Rise,
  SceneShell,
  Sub,
  useEnter,
} from "../components/base";
import { Browser, Phone, Photo } from "../components/Frames";
import { AGENT_LOOP, NEGATIVE, PERMIT, RESULT } from "../data";
import { MONO } from "../font";
import { BRAND_GRADIENT, C } from "../theme";


/* ------------------------------------------------------------------ capture */

/** Step 1: a phone, a photo, a tap. No app install, no form. */
export const DemoCapture: React.FC = () => (
  <SceneShell>
    <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", padding: "0 130px", gap: 90 }}>
      <div style={{ flex: 1 }}>
        <Eyebrow>The demo · step 1</Eyebrow>
        <div style={{ height: 20 }} />
        <Headline size={64}>
          Point a phone at the street.
          <br />
          <Grad>That&rsquo;s the whole input.</Grad>
        </Headline>
        <div style={{ height: 34 }} />
        <Sub size={30} maxWidth={720}>
          Mobile web — no install. The browser hands over the photo plus GPS; EXIF
          coordinates win when the image carries them.
        </Sub>
        <div style={{ height: 40 }} />
        <Rise delay={30}>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            {["multipart/form-data", "EXIF GPS → client GPS", "12 MB cap"].map((t) => (
              <span
                key={t}
                style={{
                  fontFamily: MONO,
                  fontSize: 20,
                  border: `1px solid ${C.border}`,
                  background: C.surface,
                  borderRadius: 999,
                  padding: "10px 20px",
                  color: C.muted,
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </Rise>
      </div>
      <Phone src="shots/04-analyze-preview.png" height={840} delay={10} />
    </AbsoluteFill>
  </SceneShell>
);

/* --------------------------------------------------------------- agent loop */

const LoopStep: React.FC<{ step: string; q: string; index: number }> = ({ step, q, index }) => {
  const p = useEnter(14 + index * 8, 22);
  return (
    <div
      style={{
        flex: 1,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [26, 0])}px)`,
        borderTop: `4px solid ${C.brandStart}`,
        paddingTop: 22,
      }}
    >
      <div
        style={{
          fontFamily: MONO,
          fontSize: 25,
          fontWeight: 700,
          letterSpacing: 0.6,
          marginBottom: 12,
        }}
      >
        {step}
      </div>
      <div style={{ fontSize: 21, color: C.muted, lineHeight: 1.35 }}>{q}</div>
    </div>
  );
};

/** The seven questions the agent answers, straight off GET /agent-loop. */
export const DemoAgentLoop: React.FC = () => (
  <SceneShell>
    <AbsoluteFill style={{ padding: "0 110px", justifyContent: "center" }}>
      <Eyebrow>GET /agent-loop</Eyebrow>
      <div style={{ height: 20 }} />
      <Headline size={62}>
        Not one prompt — <Grad>seven questions</Grad>, in order.
      </Headline>
      <div style={{ height: 70 }} />
      <div style={{ display: "flex", gap: 26, alignItems: "flex-start" }}>
        {AGENT_LOOP.map((s, i) => (
          <LoopStep key={s.step} step={s.step} q={s.q} index={i} />
        ))}
      </div>
      <div style={{ height: 76 }} />
      <Sub delay={78} size={30}>
        Each step is inspectable in the response. When a step can&rsquo;t answer
        confidently, the report is flagged for a human instead of being guessed at.
      </Sub>
    </AbsoluteFill>
  </SceneShell>
);

/* ------------------------------------------------------------------- result */

const Field: React.FC<{ k: string; v: string; delay: number; accent?: boolean }> = ({
  k,
  v,
  delay,
  accent,
}) => {
  const p = useEnter(delay, 24);
  return (
    <div
      style={{
        opacity: p,
        transform: `translateX(${interpolate(p, [0, 1], [18, 0])}px)`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        gap: 28,
        padding: "16px 0",
        borderBottom: `1px solid ${C.border}`,
      }}
    >
      <span style={{ fontFamily: MONO, fontSize: 21, color: C.muted }}>{k}</span>
      <span
        style={{
          fontSize: 24,
          fontWeight: 600,
          textAlign: "right",
          color: accent ? C.brandStart : C.text,
        }}
      >
        {v}
      </span>
    </div>
  );
};

/** The structured object, side by side with the UI that renders it. */
export const DemoResult: React.FC = () => (
  <SceneShell>
    <AbsoluteFill style={{ padding: "64px 110px", justifyContent: "center" }}>
      <Eyebrow>The demo · step 2</Eyebrow>
      <div style={{ height: 18 }} />
      <Headline size={58}>
        A photo becomes <Grad>a typed record</Grad>.
      </Headline>
      <div style={{ height: 44 }} />

      <div style={{ display: "flex", gap: 56, alignItems: "flex-start" }}>
        <div style={{ width: 780, flexShrink: 0 }}>
          <Card style={{ padding: "12px 32px 20px" }}>
            <Field k="hazard_type" v="road_debris" delay={12} />
            <Field k="severity" v="urgent" delay={18} accent />
            <Field k="confidence" v="0.98" delay={24} accent />
            <Field k="location_label" v={RESULT.locationLabel} delay={30} />
            <Field k="location_confidence" v="high" delay={36} />
            <Field k="ocr_text" v={`"${RESULT.ocrText}"`} delay={42} />
            <Field k="lane_impact" v="partial" delay={48} />
            <Field k="priority_score" v="90 / 100" delay={54} accent />
            <Field k="civic_category" v={RESULT.civicCategory} delay={60} />
            <Field k="status" v="detected" delay={66} />
            <Field k="human_review_required" v="true" delay={72} accent />
          </Card>
        </div>

        <div style={{ flex: 1 }}>
          <Browser src="shots/07-hazard-detail.png" width={880} delay={20} url="localhost:3000/hazard/693a8c67" />
        </div>
      </div>
    </AbsoluteFill>
  </SceneShell>
);

/* ------------------------------------------------------------- routing/report */

/** The output a city can act on: category, department, prose, submission. */
export const DemoReport: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <SceneShell>
      <AbsoluteFill style={{ padding: "0 130px", justifyContent: "center" }}>
        <Eyebrow>The demo · step 3</Eyebrow>
        <div style={{ height: 18 }} />
        <Headline size={60}>
          Routed to <Grad>a named department</Grad>, in their words.
        </Headline>
        <div style={{ height: 46 }} />

        <div style={{ display: "flex", gap: 44, alignItems: "stretch" }}>
          <Rise delay={14} style={{ flex: 1 }}>
            <Card style={{ height: "100%", padding: 38 }}>
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 20,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color: C.muted,
                }}
              >
                {RESULT.civicCategory}
              </div>
              <div style={{ height: 22 }} />
              <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: -0.9, lineHeight: 1.2 }}>
                Road debris — {RESULT.locationLabel}
              </div>
              <div style={{ height: 24 }} />
              <div style={{ fontSize: 25, lineHeight: 1.55, color: C.text }}>{RESULT.report}</div>
              <div style={{ height: 30 }} />
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Pill color={C.urgent} bg="#fff2e2">
                  Urgent
                </Pill>
                <Pill color={C.muted} bg="#efece4">
                  Detected
                </Pill>
                <Pill color={C.navy} bg="#e7eefa">
                  Human review
                </Pill>
              </div>
            </Card>
          </Rise>

          <div style={{ width: 620, flexShrink: 0, display: "flex", flexDirection: "column", gap: 22 }}>
            <Rise delay={26}>
              <Card style={{ padding: 30 }}>
                <div style={{ fontSize: 20, color: C.muted, marginBottom: 12 }}>Target agency</div>
                <div style={{ fontSize: 28, fontWeight: 600, lineHeight: 1.3 }}>
                  {RESULT.targetAgency}
                </div>
                <div style={{ fontSize: 19, color: C.muted, marginTop: 12, lineHeight: 1.4 }}>
                  From the SF311 lookup table — the model writes the prose, it doesn&rsquo;t
                  invent the department.
                </div>
              </Card>
            </Rise>
            <Rise delay={36}>
              <Card style={{ padding: 30, borderColor: C.brandStart }}>
                <div style={{ fontSize: 20, color: C.muted, marginBottom: 12 }}>
                  Open street-use permit within {PERMIT.distanceM} m
                </div>
                <div style={{ fontSize: 28, fontWeight: 600, lineHeight: 1.3 }}>
                  {PERMIT.contractor}
                </div>
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 21,
                    color: C.muted,
                    marginTop: 10,
                  }}
                >
                  {PERMIT.number} · {PERMIT.type} · {PERMIT.status}
                </div>
              </Card>
            </Rise>
            <Rise delay={46}>
              <div
                style={{
                  background: BRAND_GRADIENT,
                  borderRadius: 22,
                  padding: 30,
                  color: "#fff",
                }}
              >
                <div style={{ fontSize: 20, opacity: 0.9, marginBottom: 10 }}>
                  On submit
                </div>
                <div style={{ fontFamily: MONO, fontSize: 30, fontWeight: 700 }}>
                  RW-SIM-…
                </div>
                <div style={{ fontSize: 20, marginTop: 12, opacity: 0.94, lineHeight: 1.4 }}>
                  Simulated for the hackathon. Critical hazards and collisions never auto-submit.
                </div>
              </div>
            </Rise>
          </div>
        </div>
      </AbsoluteFill>
    </SceneShell>
  );
};

/* ------------------------------------------------------------------- dedupe */

/** The trust product: a second report at the same spot links, it doesn't duplicate. */
export const DemoDedupe: React.FC = () => {
  const merge = useEnter(40, 26);
  return (
    <SceneShell>
      <AbsoluteFill style={{ padding: "0 130px", justifyContent: "center" }}>
        <Eyebrow>The demo · step 4</Eyebrow>
        <div style={{ height: 18 }} />
        <Headline size={60}>
          A second report at the same spot. <Grad>Not a second ticket.</Grad>
        </Headline>
        <div style={{ height: 52 }} />

        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          <Photo
            src="imgs/IMG_5582.webp"
            width={370}
            height={250}
            label="upload 1 · new event"
            delay={12}
          />
          <Photo
            src="imgs/IMG_5582.webp"
            width={370}
            height={250}
            label="upload 2 · same hazard, 0 m"
            delay={22}
          />

          <div
            style={{
              fontSize: 44,
              color: C.muted,
              opacity: merge,
            }}
          >
            &rarr;
          </div>

          <div
            style={{
              flex: 1,
              opacity: merge,
              transform: `scale(${interpolate(merge, [0, 1], [0.94, 1])})`,
            }}
          >
            <Card style={{ padding: 34, borderColor: C.navy }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 12,
                  background: "#e7eefa",
                  color: C.navy,
                  borderRadius: 12,
                  padding: "14px 22px",
                  fontSize: 25,
                  fontWeight: 600,
                }}
              >
                Possible duplicate found 0 metres away.
              </div>
              <div style={{ height: 24 }} />
              <div style={{ fontSize: 25, lineHeight: 1.5, color: C.text }}>
                Before anything is written, the hazard is matched on type and proximity
                against existing Roadar rows <em>and</em> the live SF311 feed. The second
                upload returned <code>linked_to_existing: true</code> — no new row.
              </div>
            </Card>
          </div>
        </div>

        <div style={{ height: 54 }} />
        <Sub delay={62} size={30}>
          One physical hazard normally spawns 3&ndash;8 tickets. Collapsing them is what makes
          the queue believable to the person working it.
        </Sub>
      </AbsoluteFill>
    </SceneShell>
  );
};

/* ----------------------------------------------------------------- negative */

/** The control case. A detector that flags everything is worthless. */
export const DemoNegative: React.FC = () => (
  <SceneShell>
    <AbsoluteFill style={{ flexDirection: "row", alignItems: "center", padding: "0 130px", gap: 80 }}>
      <Photo src="imgs/IMG_5579.webp" width={720} height={480} delay={8} label="imgs/IMG_5579.webp" />
      <div style={{ flex: 1 }}>
        <Eyebrow>The demo · step 5</Eyebrow>
        <div style={{ height: 18 }} />
        <Headline size={58}>
          And it <Grad>doesn&rsquo;t cry wolf</Grad>.
        </Headline>
        <div style={{ height: 34 }} />
        <Rise delay={22}>
          <Card style={{ padding: 32 }}>
            <div style={{ fontFamily: MONO, fontSize: 24, lineHeight: 1.9 }}>
              <div>
                <span style={{ color: C.muted }}>hazard_detected</span>{" "}
                <span style={{ color: C.critical, fontWeight: 700 }}>false</span>
              </div>
              <div>
                <span style={{ color: C.muted }}>hazard_type</span>{" "}
                <span style={{ fontWeight: 700 }}>&quot;none&quot;</span>
              </div>
              <div>
                <span style={{ color: C.muted }}>confidence</span>{" "}
                <span style={{ fontWeight: 700 }}>1.0</span>
              </div>
            </div>
            <div style={{ height: 22 }} />
            <div style={{ fontSize: 23, lineHeight: 1.5, color: C.muted }}>
              &ldquo;{NEGATIVE.reasoning}&rdquo;
            </div>
          </Card>
        </Rise>
        <div style={{ height: 32 }} />
        <Sub delay={40} size={28} maxWidth={760}>
          Normal cracks, wet pavement and parked cars are explicitly not hazards. Nothing is
          persisted, so a clean street never reaches a coordinator&rsquo;s queue.
        </Sub>
      </div>
    </AbsoluteFill>
  </SceneShell>
);

/* ---------------------------------------------------------------------- map */

/** Where it lands: a prioritised public map, filterable by the enums above. */
export const DemoMap: React.FC = () => (
  <SceneShell>
    <AbsoluteFill style={{ padding: "60px 110px", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div>
          <Eyebrow>The demo · step 6</Eyebrow>
          <div style={{ height: 18 }} />
          <Headline size={58}>
            Every finding lands on <Grad>one prioritised map</Grad>.
          </Headline>
        </div>
        <Rise delay={20}>
          <div style={{ display: "flex", gap: 12 }}>
            <Pill color={C.routine} bg="#fff8e6">
              Routine
            </Pill>
            <Pill color={C.urgent} bg="#fff2e2">
              Urgent
            </Pill>
            <Pill color={C.critical} bg="#fbe6e9">
              Critical
            </Pill>
          </div>
        </Rise>
      </div>

      <div style={{ height: 40 }} />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Browser src="shots/10-dashboard-map.png" width={1420} delay={10} url="localhost:3000" />
      </div>
    </AbsoluteFill>
  </SceneShell>
);
