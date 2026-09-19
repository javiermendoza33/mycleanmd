"use client";

import { useState } from "react";
import { ABOUT } from "@/labo/content";

/**
 * Three images stacked in one rounded card and cross-faded by opacity.
 *
 * All three are in the DOM from first paint, so advancing never shows an empty
 * frame — the handoff is explicit: do NOT implement this by swapping a single
 * `src`. Both directions wrap. No autoplay.
 *
 * Controls are real <button>s with labels; the prototype used anchors with no
 * keyboard support, which the handoff lists as a gap to fix rather than copy.
 */
export default function Carousel() {
  const [i, setI] = useState(0);
  const slides = ABOUT.slides;
  const go = (n: number) => setI((n + slides.length) % slides.length);

  return (
    <div>
      <div className="car">
        {slides.map((s, n) => (
          <img key={s.src} className={`car-img${n === i ? " on" : ""}`}
               src={s.src} alt={n === i ? s.caption : ""} aria-hidden={n !== i}
               style={{ objectPosition: s.pos }} />
        ))}
        <div className="car-bar">
          <div className="car-dots" role="tablist" aria-label="Choose photo">
            {slides.map((s, n) => (
              <button key={s.src} type="button" role="tab" aria-selected={n === i}
                      aria-label={`Photo ${n + 1}: ${s.caption}`}
                      className={`car-dot${n === i ? " on" : ""}`} onClick={() => setI(n)} />
            ))}
          </div>
          <div className="car-arrows">
            <button type="button" className="car-arrow" aria-label="Previous photo"
                    onClick={() => go(i - 1)}>←</button>
            <button type="button" className="car-arrow" aria-label="Next photo"
                    onClick={() => go(i + 1)}>→</button>
          </div>
        </div>
      </div>
      <p className="car-cap" aria-live="polite">{slides[i].caption}</p>
    </div>
  );
}
