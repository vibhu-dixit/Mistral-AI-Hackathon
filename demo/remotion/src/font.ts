import { loadFont } from "@remotion/google-fonts/Inter";

/**
 * Loaded once and referenced everywhere, so the render is identical on any
 * machine instead of falling back to whatever system-ui happens to be.
 */
export const { fontFamily: FONT } = loadFont("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

/** Monospace is left to the system stack — only used for small technical labels. */
export const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";
