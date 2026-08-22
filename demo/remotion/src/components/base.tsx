import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT } from "../font";
import { BRAND_GRADIENT, C } from "../theme";

/** Every animation is frame-driven; no CSS transitions anywhere in this project. */

export const useEnter = (delay = 0, damping = 200) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping } });
};

/** Fade + lift, the default entrance for every block of copy. */
export const Rise: React.FC<{
  delay?: number;
  distance?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ delay = 0, distance = 28, children, style }) => {
  const p = useEnter(delay);
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [distance, 0])}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Holds a scene on screen, then fades the whole thing out at the very end. */
export const SceneShell: React.FC<{
  children: React.ReactNode;
  dark?: boolean;
  outAt?: number;
}> = ({ children, dark, outAt }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const end = outAt ?? durationInFrames - Math.round(0.4 * fps);
  const fadeOut = interpolate(frame, [end, end + Math.round(0.4 * fps)], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        backgroundColor: dark ? C.ink : C.bg,
        color: dark ? C.inkText : C.text,
        fontFamily: FONT,
        opacity: fadeOut,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** Small orange eyebrow above a headline. */
export const Eyebrow: React.FC<{ children: React.ReactNode; delay?: number; dark?: boolean }> = ({
  children,
  delay = 0,
}) => (
  <Rise delay={delay}>
    <div
      style={{
        fontSize: 22,
        fontWeight: 700,
        letterSpacing: 3.4,
        textTransform: "uppercase",
        color: C.brandStart,
      }}
    >
      {children}
    </div>
  </Rise>
);

export const Headline: React.FC<{
  children: React.ReactNode;
  delay?: number;
  size?: number;
  dark?: boolean;
}> = ({ children, delay = 0, size = 76, dark }) => (
  <Rise delay={delay}>
    <h1
      style={{
        fontSize: size,
        lineHeight: 1.06,
        fontWeight: 700,
        letterSpacing: -2.2,
        margin: 0,
        color: dark ? C.inkText : C.text,
      }}
    >
      {children}
    </h1>
  </Rise>
);

export const Sub: React.FC<{
  children: React.ReactNode;
  delay?: number;
  size?: number;
  dark?: boolean;
  maxWidth?: number;
}> = ({ children, delay = 0, size = 30, dark, maxWidth = 1150 }) => (
  <Rise delay={delay}>
    <p
      style={{
        fontSize: size,
        lineHeight: 1.5,
        margin: 0,
        maxWidth,
        color: dark ? C.inkMuted : C.muted,
        fontWeight: 400,
      }}
    >
      {children}
    </p>
  </Rise>
);

/** Gradient text used for the one phrase per scene that should carry. */
export const Grad: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span
    style={{
      background: BRAND_GRADIENT,
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
    }}
  >
    {children}
  </span>
);

export const Card: React.FC<{
  children: React.ReactNode;
  dark?: boolean;
  style?: React.CSSProperties;
}> = ({ children, dark, style }) => (
  <div
    style={{
      background: dark ? C.inkSoft : C.surface,
      border: `1px solid ${dark ? C.inkBorder : C.border}`,
      borderRadius: 22,
      padding: 30,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Counts a number up as the scene plays. */
export const Counter: React.FC<{
  to: number;
  delay?: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  style?: React.CSSProperties;
}> = ({ to, delay = 0, duration = 30, decimals = 0, prefix = "", suffix = "", style }) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [delay, delay + duration], [0, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  return (
    <span style={style}>
      {prefix}
      {v.toFixed(decimals)}
      {suffix}
    </span>
  );
};

export const Pill: React.FC<{
  children: React.ReactNode;
  color: string;
  bg: string;
  size?: number;
}> = ({ children, color, bg, size = 20 }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      background: bg,
      color,
      borderRadius: 999,
      padding: `7px 16px`,
      fontSize: size,
      fontWeight: 600,
      whiteSpace: "nowrap",
    }}
  >
    <span style={{ width: 8, height: 8, borderRadius: 999, background: color }} />
    {children}
  </span>
);

/** Thin progress rule that fills as the scene plays — used under headlines. */
export const Rule: React.FC<{ delay?: number; width?: number }> = ({ delay = 0, width = 130 }) => {
  const p = useEnter(delay);
  return (
    <div
      style={{
        height: 5,
        width: width * p,
        borderRadius: 999,
        background: BRAND_GRADIENT,
      }}
    />
  );
};
