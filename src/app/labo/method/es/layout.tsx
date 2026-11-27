import type { Metadata } from "next";

/** Everything under /es is Spanish: Open Graph says so. The header, footer and `lang` attribute follow the URL (MethodChrome.tsx). */
export const metadata: Metadata = { openGraph: { locale: "es_US" } };

export default function MethodEsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
