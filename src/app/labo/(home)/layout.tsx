import BagDrawer from "@/components/labo/shop/BagDrawer";
import SearchOverlay from "@/components/labo/search/SearchOverlay";
import A11yWidget from "@/components/labo/A11yWidget";

/** Home route group wrapper — [data-clinic] carries the clinic storefront tokens (labo.css); the portals stay outside it.
 *  The bag drawer (Nov 19 2026) mounts here so "Add to bag" works on the home page's best-seller row; the search
 *  overlay (Nov 21 2026) mounts alongside it for the same reason — it has to be reachable from this page's header too. */
export default function LaboHomeLayout({ children }: { children: React.ReactNode }) {
  return <div data-clinic>{children}<BagDrawer /><SearchOverlay /><A11yWidget /></div>;
}
