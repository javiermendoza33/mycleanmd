import Link from "next/link";
import type { ReactNode } from "react";
import type { Service, Testimonial } from "@/labo/clinic/types";
import { CLINIC_SITE, type ClinicLocation } from "@/labo/clinic/site";
import { PRACTICE } from "@/labo/content";

/**
 * Clinic-page building blocks (Nov 18 2026) — the Skin Haven site's cards,
 * quotes, locations, partner strip, accordion and booking band, rebuilt in the
 * emerald/gold vocabulary of labo.css. Plain <img> like the rest of /labo.
 */

export function SectionHead({ eyebrow, title, lede, left }: { eyebrow: string; title: ReactNode; lede?: ReactNode; left?: boolean }) {
  return (
    <div className={`sechead${left ? " left" : ""}`}>
      <span className="kicker">{eyebrow}</span>
      <h2>{title}</h2>
      {lede && <p className="sub">{lede}</p>}
    </div>
  );
}

export function ServiceCard({ service, headingLevel = "h3" }: { service: Service; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  const href = service.comingSoon ? undefined : service.href ?? `/services/${service.slug}`;
  const body = (
    <>
      {service.comingSoon && <span className="pill">Coming soon</span>}
      <div className="img"><img src={service.image.src} alt={service.image.alt} loading="lazy" /></div>
      <div className="cb">
        <Heading>{service.name}</Heading>
        {service.brand && <span className="brandline">{service.brand}</span>}
        <p>{service.tagline}</p>
        <span className="more">{service.comingSoon ? "Stay tuned" : "Learn more"}</span>
      </div>
    </>
  );
  return href ? <Link href={href} className="card">{body}</Link> : <article className="card">{body}</article>;
}

export function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <blockquote className="quote">
      <p>{t.quote}</p>
      <footer><b>{t.author}</b><small>{t.role}</small></footer>
    </blockquote>
  );
}

export function LocationCard({ location }: { location: ClinicLocation }) {
  const s = CLINIC_SITE;
  return (
    <div className="loc">
      <span className="kicker">{PRACTICE.name} · {location.cityLabel}</span>
      <h3>{location.name}</h3>
      <address>
        <a href={location.mapUrl} target="_blank" rel="noopener noreferrer">
          {location.address1}<br />{location.address2}
          <span className="dir">Get directions ›</span>
        </a>
      </address>
      <p className="how"><b>{location.contactNote}:</b> {s.phoneDisplay}</p>
      <div className="acts">
        {location.bookOnline
          ? <Link href="/booking" className="btn btn-primary">Book online</Link>
          : <a href={s.sms} className="btn btn-primary">Text to book</a>}
        <a href={location.bookOnline ? s.tel : s.sms} className="btn btn-ghost">{location.bookOnline ? "Call us" : "Text us"}</a>
      </div>
    </div>
  );
}

export function MapEmbed({ src, title }: { src: string; title: string }) {
  return <iframe className="map" src={src} title={title} loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" />;
}

const PARTNERS = [
  { name: "Allergan", src: "/labo/img/partners/allergan.jpg" },
  { name: "Galderma", src: "/labo/img/partners/galderma.jpg" },
  { name: "SkinBetter Science", src: "/labo/img/partners/skinbetter.jpg" },
  { name: "SkinPen", src: "/labo/img/partners/skinpen.jpg" },
  { name: "SkinMedica", src: "/labo/img/partners/skinmedica.png" },
  { name: "Latisse", src: "/labo/img/partners/latisse.png" },
  { name: "Alastin", src: "/labo/img/partners/alastin.jpg" },
  { name: "Upneeq", src: "/labo/img/partners/upneeq.jpg" },
  { name: "Mint PDO Threads", src: "/labo/img/partners/mint.jpg" },
  { name: "NovaThreads", src: "/labo/img/partners/novathreads.jpg" },
  { name: "BENEV", src: "/labo/img/partners/benev.jpg" },
  { name: "Vitality", src: "/labo/img/partners/vitality.jpg" },
  { name: "Xtetic", src: "/labo/img/partners/xtetic.jpg" },
  { name: "Omni", src: "/labo/img/partners/omni.jpg" },
  { name: "ProGen", src: "/labo/img/partners/progen.jpg" },
];

export function PartnerLogos() {
  return (
    <ul className="partners">
      {PARTNERS.map((p) => <li key={p.name}><img src={p.src} alt={p.name} loading="lazy" /></li>)}
    </ul>
  );
}

/** <details> accordion — works without JS, one per care sheet or FAQ. */
export function Acc({ title, children, open }: { title: string; children: ReactNode; open?: boolean }) {
  return (
    <details className="acc" open={open}>
      <summary>{title}</summary>
      <div className="accb">{children}</div>
    </details>
  );
}

/** Paragraph strings; consecutive "- " entries become one bullet list (the care sheets and FAQ answers use this). */
export function Rich({ blocks, className = "" }: { blocks: string[]; className?: string }) {
  const groups: Array<{ type: "p"; text: string } | { type: "ul"; items: string[] }> = [];
  for (const b of blocks) {
    if (b.startsWith("- ")) {
      const last = groups[groups.length - 1];
      if (last && last.type === "ul") last.items.push(b.slice(2));
      else groups.push({ type: "ul", items: [b.slice(2)] });
    } else groups.push({ type: "p", text: b });
  }
  return (
    <div className={`rich ${className}`}>
      {groups.map((g, i) => g.type === "p"
        ? <p key={i}>{g.text}</p>
        : <ul key={i}>{g.items.map((it, j) => <li key={j}>{it}</li>)}</ul>)}
    </div>
  );
}

/** The phone-first closing band the old site ended every page with. */
export function BookCta() {
  const s = CLINIC_SITE;
  return (
    <section className="bookcta">
      <div className="wrap">
        <span className="kicker">{PRACTICE.name}</span>
        <h2>Ready to schedule your treatment?</h2>
        <p className="sub">Enjoy our one-of-a-kind treatments at {PRACTICE.name}.</p>
        <a className="tel" href={s.tel}>{s.phoneDisplay}</a>
        <div className="acts">
          <Link href="/booking" className="btn btn-primary">Book online</Link>
          <a href={s.sms} className="btn btn-ghost">Text us</a>
        </div>
      </div>
    </section>
  );
}

/** The clinic's Vagaro scheduler. Its loader uses document.write, so it only works at parse time inside its own document. */
export function VagaroWidget() {
  const doc = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<style>body{margin:0;padding:12px 14px 0;font-family:system-ui,sans-serif;box-sizing:border-box}.vagaro{width:100%;padding:0;border:0;margin:0 auto}.vagaro>a{font-size:11px;color:#9a9a9a;text-decoration:none;margin-right:10px}</style></head>
<body><div class="vagaro"><a href="https://sales.vagaro.com/" target="_blank" rel="noopener">Powered by Vagaro</a>
<script type="text/javascript" src="${CLINIC_SITE.vagaroWidgetUrl}"><\/script></div></body></html>`;
  return <iframe className="embed book" srcDoc={doc} title={`Book an appointment — ${PRACTICE.name} online scheduler`} />;
}
