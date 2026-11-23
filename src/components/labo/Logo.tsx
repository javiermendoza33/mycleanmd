import type { CSSProperties } from "react";

/**
 * The "L" marks (Nov 23 2026, from Javier's concept board): a solid rounded L for The Labo Clinic, an outlined L with a dot
 * for The Labo Method. Inline SVG so they take currentColor; the outline's inner stroke uses --logo-bg (the surface behind it).
 */
export function LMark({ variant = "clinic", size = 28, className = "" }: { variant?: "clinic" | "method"; size?: number; className?: string }) {
  const d = "M28 14 V64 a18 18 0 0 0 18 18 H86";
  return (
    <svg className={`lmark ${className}`} width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      {variant === "clinic" ? (
        <path d={d} fill="none" stroke="currentColor" strokeWidth="26" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <>
          <path d={d} fill="none" stroke="currentColor" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" />
          <path d={d} fill="none" stroke="var(--logo-bg, #F8F4EE)" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="28" cy="24" r="5" fill="currentColor" />
        </>
      )}
    </svg>
  );
}

/** Mark + wordmark lockup. Clinic = bold tracked caps; Method = light, wider tracking. */
export function Logo({ variant = "clinic", name, size = 28, style }: { variant?: "clinic" | "method"; name: string; size?: number; style?: CSSProperties }) {
  return (
    <span className={`logo logo-${variant}`} style={style}>
      <LMark variant={variant} size={size} />
      <span className="logo-word">{name}</span>
    </span>
  );
}
