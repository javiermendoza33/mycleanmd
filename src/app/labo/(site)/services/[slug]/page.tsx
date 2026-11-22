import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { availableServices, getService, services } from "@/labo/clinic/services";
import { careInstructions } from "@/labo/clinic/patient-care";
import { Acc, BookCta, Rich, ServiceCard } from "@/components/labo/Clinic";
import { PRACTICE } from "@/labo/content";

export const dynamicParams = false;
export function generateStaticParams() { return availableServices.map((s) => ({ slug: s.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return {};
  return { title: { absolute: s.seo.title }, description: s.seo.description, alternates: { canonical: `/services/${s.slug}` }, openGraph: { images: [{ url: s.image.src, alt: s.image.alt }] } };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service || service.comingSoon || service.href) notFound();
  const hasCare = careInstructions.some((c) => c.serviceSlug === service.slug);
  const related = services.filter((s) => s.slug !== service.slug && !s.comingSoon).slice(0, 3);

  const base = `https://${PRACTICE.domain}`;
  const jsonLd = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Treatments", item: `${base}/services` },
      { "@type": "ListItem", position: 2, name: service.name, item: `${base}/services/${service.slug}` }] },
    { "@context": "https://schema.org", "@type": "MedicalProcedure", name: service.name, description: service.seo.description, url: `${base}/services/${service.slug}`, image: `${base}${service.image.src}`, provider: { "@id": `${base}/#clinic` } },
    ...(service.faqs.length ? [{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: service.faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer.map((a) => a.replace(/^- /, "")).join(" ") } })) }] : []),
  ];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="pageh" style={{ paddingBottom: 0 }}>
        <div className="wrap split">
          <div>
            <nav className="crumb" aria-label="Breadcrumb"><Link href="/services">Treatments</Link> / <b>{service.name}</b></nav>
            <h1 style={{ marginTop: 16 }}>{service.name}</h1>
            {service.brand && <span className="kicker" style={{ display: "block", marginTop: 12 }}>{service.brand}</span>}
            <div className="prose" style={{ marginTop: 22 }}>
              {service.intro.map((p, i) => <p key={i} className="sub">{p}</p>)}
              <div className="acts">
                <Link href="/booking" className="btn btn-primary">Book this treatment</Link>
                {hasCare && <Link href="/patient-care" className="btn btn-ghost">Pre &amp; post care</Link>}
              </div>
              {service.telehealthHref && (
                <p className="sub" style={{ marginTop: 18 }}>
                  Prefer not to come in? <a href={service.telehealthHref} target="_blank" rel="noopener noreferrer">{service.name} is also available by video through The Labo Method ↗</a>
                </p>
              )}
            </div>
          </div>
          <div className="frame sq"><img src={service.image.src} alt={service.image.alt} /></div>
        </div>
      </section>

      {service.highlights && service.highlights.length > 0 && (
        <section>
          <div className="wrap">
            <div className="sechead" style={{ marginBottom: 0 }}><span className="kicker">What it can treat</span></div>
            <ul className="checks grid" style={{ marginInline: "auto" }}>
              {service.highlights.map((h) => <li key={h}>{h}</li>)}
            </ul>
          </div>
        </section>
      )}

      {service.faqs.length > 0 && (
        <section className={service.highlights?.length ? "grey" : undefined}>
          <div className="wrap tight">
            <div className="sechead left">
              <span className="kicker">Frequently asked questions</span>
              <h2>Everything to know about {service.name.toLowerCase()}</h2>
            </div>
            {service.faqs.map((f, i) => (
              <Acc key={f.question} title={f.question} open={i === 0}><Rich blocks={f.answer} /></Acc>
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="wrap">
          <div className="sechead"><span className="kicker">Keep exploring</span><h2>More treatments to love</h2></div>
          <div className="cards">{related.map((s) => <ServiceCard key={s.slug} service={s} />)}</div>
        </div>
      </section>
      <BookCta />
    </>
  );
}
