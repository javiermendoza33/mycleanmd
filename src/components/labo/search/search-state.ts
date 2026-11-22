"use client";

import { useEffect, useState } from "react";

/** Open/close event for the search overlay — same tiny window-event pattern as the bag drawer
 *  (see shop/bag.ts), so any button anywhere (header, mobile nav sheet) can trigger it without
 *  prop-drilling or context. */
const OPEN = "labo-search-open";
export const openSearch = () => window.dispatchEvent(new CustomEvent(OPEN));

export function useSearchOpen() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener(OPEN, show);
    return () => window.removeEventListener(OPEN, show);
  }, []);
  return { open, setOpen };
}
