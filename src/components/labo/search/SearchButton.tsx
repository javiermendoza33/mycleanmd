"use client";

import { openSearch } from "./search-state";

/** The header's search icon — opens SearchOverlay (mounted once per clinic layout). Icon-only so it
 *  costs no header width at 1440, where the nav already wraps "How it works" (Chrome.tsx note). */
export default function SearchButton({ className = "" }: { className?: string }) {
  return (
    <button type="button" className={`search-btn ${className}`} onClick={openSearch} aria-label="Search services and products">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.6" />
        <line x1="12.4" y1="12.4" x2="17" y2="17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </button>
  );
}
