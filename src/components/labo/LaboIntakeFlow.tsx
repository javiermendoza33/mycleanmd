"use client";

import IntakeFlow, { IntakeStep } from "@/components/IntakeFlow";

export default function LaboIntakeFlow(
  { enrollmentId, careType, steps }: { enrollmentId: string; careType: string; steps: IntakeStep[] }
) {
  return (
    <IntakeFlow
      config={{
        backHref: "/portal",
        doneHref: "/portal",
        careType,
        steps,
        saveUrl: "/api/labo/intake/save",
        extraBody: { enrollmentId },
      }}
    />
  );
}
