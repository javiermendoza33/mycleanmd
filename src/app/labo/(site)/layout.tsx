import { Newsreader, Public_Sans } from "next/font/google";
import { Header, Footer } from "@/components/labo/Chrome";

/**
 * Inner pages of thelabomethod.com — the earlier token system ([data-labo] in
 * ../labo.css) with the shared Header/Footer. The homepage no longer renders
 * through here; see ../layout.tsx for why the two groups own their own chrome.
 */
const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["200", "300", "400", "500", "600"],
  variable: "--font-newsreader",
  display: "swap",
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-public-sans",
  display: "swap",
});

export default function LaboSiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-labo className={`${newsreader.variable} ${publicSans.variable}`}>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
