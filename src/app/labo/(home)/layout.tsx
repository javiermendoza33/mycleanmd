import BagDrawer from "@/components/labo/shop/BagDrawer";

/** Home route group wrapper — [data-clinic] carries the clinic storefront tokens (labo.css); the portals stay outside it.
 *  The bag drawer (Nov 19 2026) mounts here so "Add to bag" works on the home page's best-seller row. */
export default function LaboHomeLayout({ children }: { children: React.ReactNode }) {
  return <div data-clinic>{children}<BagDrawer /></div>;
}
