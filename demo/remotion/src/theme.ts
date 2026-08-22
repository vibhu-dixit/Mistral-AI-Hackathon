/**
 * Design tokens lifted verbatim from web-app/src/app/globals.css so the video
 * and the product read as one system.
 */
export const C = {
  bg: "#fbfaf6",
  surface: "#ffffff",
  border: "#e7e4dc",
  text: "#17171c",
  muted: "#6b6a66",

  brandStart: "#fa500f",
  brandEnd: "#fec63a",
  navy: "#044298",

  routine: "#fec63a",
  urgent: "#ff8204",
  critical: "#c4001d",

  reported: "#2da771",
  resolved: "#15cf74",

  // dark-scene ground, for the market act
  ink: "#101014",
  inkSoft: "#1c1c22",
  inkBorder: "#2e2e38",
  inkText: "#f4f2ee",
  inkMuted: "#9a978f",
} as const;

export const BRAND_GRADIENT = `linear-gradient(100deg, ${C.brandStart} 0%, ${C.brandEnd} 100%)`;

export const FPS = 30;
export const W = 1920;
export const H = 1080;

/** seconds → frames */
export const s = (seconds: number) => Math.round(seconds * FPS);
