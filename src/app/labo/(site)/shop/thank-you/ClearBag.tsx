"use client";

import { useEffect } from "react";
import { useBag } from "@/components/labo/shop/bag";

/** Stripe sent the shopper back here, so the bag is done. */
export default function ClearBag() { const { clear } = useBag(); useEffect(() => { clear(); }, [clear]); return null; }
