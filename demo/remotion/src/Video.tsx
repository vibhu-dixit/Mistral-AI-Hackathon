import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";

import { Watermark } from "./components/Frames";
import { Close, Recap } from "./scenes/Close";
import {
  DemoAgentLoop,
  DemoCapture,
  DemoDedupe,
  DemoMap,
  DemoNegative,
  DemoReport,
  DemoResult,
} from "./scenes/DemoFlow";
import { DemoPipeline } from "./scenes/DemoPipeline";
import {
  MarketIntro,
  MarketPrivacy,
  MarketSize,
  MarketStorm,
  MarketValue,
  MarketWedge,
} from "./scenes/Market";
import { ProblemChain, ProblemScale } from "./scenes/Problem";
import { Title } from "./scenes/Title";
import { C, s } from "./theme";

const XF = 14; // frames of cross-fade between scenes

/**
 * Scene order. Act 2 (the product demo) runs first and longest; the market
 * analysis follows it, which is the order the user asked for.
 */
export const SCENES = [
  { id: "title", C: Title, sec: 6.0 },
  { id: "problem-chain", C: ProblemChain, sec: 8.0 },
  { id: "problem-scale", C: ProblemScale, sec: 8.5 },

  { id: "demo-capture", C: DemoCapture, sec: 7.5 },
  { id: "demo-pipeline", C: DemoPipeline, sec: 10.5 },
  { id: "demo-agent-loop", C: DemoAgentLoop, sec: 8.5 },
  { id: "demo-result", C: DemoResult, sec: 9.0 },
  { id: "demo-report", C: DemoReport, sec: 9.0 },
  { id: "demo-dedupe", C: DemoDedupe, sec: 9.0 },
  { id: "demo-negative", C: DemoNegative, sec: 8.0 },
  { id: "demo-map", C: DemoMap, sec: 7.0 },

  { id: "market-intro", C: MarketIntro, sec: 6.5 },
  { id: "market-wedge", C: MarketWedge, sec: 10.0 },
  { id: "market-storm", C: MarketStorm, sec: 10.0 },
  { id: "market-size", C: MarketSize, sec: 9.5 },
  { id: "market-value", C: MarketValue, sec: 9.5 },
  { id: "market-privacy", C: MarketPrivacy, sec: 8.5 },

  { id: "recap", C: Recap, sec: 8.0 },
  { id: "close", C: Close, sec: 9.0 },
] as const;

/** Total length, accounting for the overlap each transition eats. */
export const TOTAL_FRAMES =
  SCENES.reduce((acc, sc) => acc + s(sc.sec), 0) - (SCENES.length - 1) * XF;

export const RoadWatchDemo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.bg }}>
    <TransitionSeries>
      {SCENES.map((scene, i) => (
        <React.Fragment key={scene.id}>
          <TransitionSeries.Sequence durationInFrames={s(scene.sec)}>
            <scene.C />
          </TransitionSeries.Sequence>
          {i < SCENES.length - 1 ? (
            <TransitionSeries.Transition
              presentation={fade()}
              timing={linearTiming({ durationInFrames: XF })}
            />
          ) : null}
        </React.Fragment>
      ))}
    </TransitionSeries>
    <Watermark />
  </AbsoluteFill>
);
