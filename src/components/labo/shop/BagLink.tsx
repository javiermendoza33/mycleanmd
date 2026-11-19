"use client";

import { openBag, useBag } from "./bag";

/** The header's Bag (n) button — opens the drawer mounted in the clinic layouts. */
export default function BagLink({ className = "" }: { className?: string }) {
  const { count } = useBag();
  return (
    <button type="button" className={`baglink ${className}`} onClick={openBag} aria-label={`Open bag, ${count} item${count === 1 ? "" : "s"}`}>
      Bag <b>({count})</b>
    </button>
  );
}
