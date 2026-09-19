"use client";

import { useState } from "react";
import { FAQ } from "@/labo/content";

/**
 * Single-open accordion, index 0 open initially — as the prototype behaved.
 * Triggers are <button>s carrying aria-expanded/aria-controls; the prototype
 * used bare anchors, which the handoff lists as an accessibility gap to fix.
 */
export default function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <div>
      {FAQ.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q} className="faq-item">
            <h2 style={{ margin: 0 }}>
              <button type="button" className="faq-q" aria-expanded={isOpen}
                      aria-controls={`faq-a-${i}`} onClick={() => setOpen(isOpen ? -1 : i)}>
                <span>{f.q}</span>
                <span className="faq-sign" aria-hidden="true">{isOpen ? "−" : "+"}</span>
              </button>
            </h2>
            {isOpen && <p className="faq-a" id={`faq-a-${i}`}>{f.a}</p>}
          </div>
        );
      })}
    </div>
  );
}
