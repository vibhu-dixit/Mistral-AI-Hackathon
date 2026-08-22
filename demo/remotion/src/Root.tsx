import React from "react";
import { Composition } from "remotion";
import { RoadarDemo, SCENES, TOTAL_FRAMES } from "./Video";
import { FPS, H, W, s } from "./theme";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="RoadarDemo"
      component={RoadarDemo}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={W}
      height={H}
    />

    {/* One composition per scene, so a single beat can be re-cut without
        scrubbing the whole timeline. */}
    {SCENES.map((scene) => (
      <Composition
        key={scene.id}
        id={`scene-${scene.id}`}
        component={scene.C}
        durationInFrames={s(scene.sec)}
        fps={FPS}
        width={W}
        height={H}
      />
    ))}
  </>
);
