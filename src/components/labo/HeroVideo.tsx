"use client";

import { useEffect, useState } from "react";

/** The home hero's looping clinic video. The poster is the video's own first frame and the video fades in
 *  over it once it can play, so a refresh never flashes from one picture to another (Javier, Nov 18 2026). */
export default function HeroVideo() {
  const [ready, setReady] = useState(false);
  const [src, setSrc] = useState<string | null>(null);
  // Nov 18 2026 (Javier: "make the mobile version with the video movement of swimmer as well"): phones play it too, from a
  // lighter 960px encode (hero-mobile.mp4, ~1/3 the bytes). Only data-saver and reduced-motion users keep the still poster.
  useEffect(() => {
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    if (nav.connection?.saveData || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setSrc(window.matchMedia("(max-width: 760px)").matches ? "/labo/img/hero-mobile.mp4" : "/labo/img/hero.mp4");
  }, []);
  if (!src) return null;
  return (
    <video
      className={ready ? "on" : undefined}
      autoPlay muted loop playsInline preload="auto"
      poster="/labo/img/hero-poster.jpg"
      aria-hidden="true"
      onCanPlay={() => setReady(true)}
      onPlaying={() => setReady(true)}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
