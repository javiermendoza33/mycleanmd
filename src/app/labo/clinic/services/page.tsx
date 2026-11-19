import { requireStaff } from "@/lib/labo/clinic";
import { getMenu } from "@/lib/labo/booking";
import { MENU } from "@/labo/clinic/booking";
import ServicesTable from "@/components/labo/clinic/ServicesTable";

export default async function ClinicServices() {
  const s = await requireStaff("admin");
  if (!s) return <div className="card"><h3>Admin only</h3><p className="muted" style={{ marginTop: 8 }}>Ask an admin to change services or prices.</p></div>;
  const live = await getMenu(); const liveBy = new Map(live.map((m) => [m.slug, m]));
  const rows = MENU.map((m) => { const l = liveBy.get(m.slug); return { slug: m.slug, category: m.category, name: l?.name ?? m.name, min: l?.min ?? m.min, price: l?.price ?? m.price, priceNote: l?.priceNote ?? m.priceNote ?? "", active: !!l }; });
  return (
    <>
      <div className="top"><div><h1>Services &amp; prices</h1><p>What the website offers, how long it takes, what it says about price</p></div></div>
      <ServicesTable rows={rows} />
    </>
  );
}
