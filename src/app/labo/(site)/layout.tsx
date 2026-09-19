import { Header, Footer } from "@/components/labo/Chrome";

/**
 * Inner pages of thelabomethod.com — the White Room system with the shared
 * route-aware Header/Footer. The homepage renders its own chrome inline (the
 * prototype's, ported as-is); everything else comes through here. Tokens,
 * fonts and the [data-labo] scope live one level up in ../layout.tsx.
 */
export default function LaboSiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
