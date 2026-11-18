/** Home route group wrapper — [data-clinic] carries the warm clinic accent (labo.css, Nov 18 2026); the portals stay outside it. */
export default function LaboHomeLayout({ children }: { children: React.ReactNode }) {
  return <div data-clinic>{children}</div>;
}
