import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "RoadWatch",
  description: "Image-powered road hazard observations",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
