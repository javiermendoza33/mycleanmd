import { Inter, IBM_Plex_Mono } from "next/font/google";
import "./home.css";

/**
 * Homepage chrome for thelabomethod.com — the "Labo White Room" prototype
 * (design handoff, 18 Sep 2026). Inter stands in for SF Pro; IBM Plex Mono
 * carries every number, unit and eyebrow. Single light theme by design:
 * "the white room only works as a white room" — do not add a dark mode.
 */
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export default function LaboHomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-labo-home className={`${inter.variable} ${plexMono.variable}`}>
      {children}
    </div>
  );
}
