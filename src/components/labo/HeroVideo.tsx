"use client";

import { useEffect, useState } from "react";

/** The home hero's looping clinic video. The poster is the video's own first frame and the video fades in
 *  over it once it can play, so a refresh never flashes from one picture to another (Javier, Nov 18 2026). */
export default function HeroVideo() {
  const [ready, setReady] = useState(false);
  const [allow, setAllow] = useState(false);
  // Phones and data-saver connections get the poster only (Core Web Vitals: no 5 MB download on mobile).
  useEffect(() => {
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    setAllow(window.matchMedia("(min-width: 761px)").matches && !nav.connection?.saveData);
  }, []);
  if (!allow) return null;
  return (
    <video
      className={ready ? "on" : undefined}
      autoPlay muted loop playsInline preload="auto"
      poster="/labo/img/hero-poster.jpg"
      aria-hidden="true"
      onCanPlay={() => setReady(true)}
      onPlaying={() => setReady(true)}
    >
      <source src="/labo/img/hero.mp4" type="video/mp4" />
    </video>
  );
}
