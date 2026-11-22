"use client";

import { useState } from "react";
import SkinQuiz from "./SkinQuiz";
import TreatmentQuiz from "./TreatmentQuiz";

/** The home page's quiz card (Nov 21 2026): two finders in one box — the in-clinic treatment finder (from Javier's
 *  blueprint PDF) and the skincare routine finder. Treatment first: it's a clinic. */
export default function QuizTabs({ initial = "treatment" }: { initial?: "treatment" | "skincare" }) {
  const [tab, setTab] = useState<"treatment" | "skincare">(initial);
  return (
    <div>
      <div className="quiztabs" role="tablist" aria-label="Choose a quiz">
        <button type="button" role="tab" aria-selected={tab === "treatment"} className={tab === "treatment" ? "on" : ""} onClick={() => setTab("treatment")}>In-clinic treatment</button>
        <button type="button" role="tab" aria-selected={tab === "skincare"} className={tab === "skincare" ? "on" : ""} onClick={() => setTab("skincare")}>Skincare routine</button>
      </div>
      {tab === "treatment" ? <TreatmentQuiz /> : <SkinQuiz />}
    </div>
  );
}
