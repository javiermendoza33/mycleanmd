import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { getPostFor, fromOtherLang, twinSlug } from "@/labo/method/posts";
import { ClosingCTA } from "@/components/labo/Sections";
import { METHOD } from "@/labo/content";
import { mc, lh, type Lang } from "@/labo/method/i18n";

const url = (lang: Lang, slug: string) => (lang === "es" ? `/es/blog/${slug}` : `/blog/${slug}`);

/** Metadata for one article: its own canonical, plus the hreflang pair when it exists in the other language. */
export function postMetadata(lang: Lang, slug: string): Metadata {
  const p = getPostFor(lang, slug);
  if (!p) return {};
  const twin = twinSlug(lang, slug), other: Lang = lang === "es" ? "en" : "es";
  const languages = twin ? { [lang]: url(lang, slug), [other]: url(other, twin), "x-default": lang === "en" ? url("en", slug) : url("en", twin) } : undefined;
  return { title: { absolute: p.seo.title }, description: p.seo.description, alternates: { canonical: url(lang, slug), languages }, openGraph: { type: "article", locale: mc(lang).t.ogLocale, images: [{ url: p.image.src, alt: p.image.alt }] } };
}

/** One Journal article. A slug from the OTHER language (the language switch keeps the slug) is sent to this language's article. */
export default function PostView({ lang, slug }: { lang: Lang; slug: string }) {
  const post = getPostFor(lang, slug);
  if (!post) { const mine = fromOtherLang(lang, slug); if (mine) permanentRedirect(url(lang, mine)); notFound(); }
  const b = mc(lang).t.blog;
  const fmt = new Intl.DateTimeFormat(b.dateLocale, { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
  const base = `https://${METHOD.domain}`, here = `${base}${url(lang, post.slug)}`;
  const jsonLd = {
    "@context": "https://schema.org", "@type": "MedicalWebPage", headline: post.title, description: post.excerpt, inLanguage: lang,
    datePublished: post.date, dateModified: post.date, image: `${base}${post.image.src}`,
    url: here, mainEntityOfPage: here,
    publisher: { "@type": "Organization", name: METHOD.name, url: base },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article>
        <header className="pageh" style={{ paddingBottom: 0 }}>
          <div className="wrap posthead">
            <nav className="crumb" aria-label="Breadcrumb"><Link href={lh(lang, "/blog")}>{b.crumb}</Link></nav>
            <h1>{post.title}</h1>
            <time className="date" dateTime={post.date}>{fmt.format(new Date(post.date))}</time>
          </div>
        </header>
        <section style={{ paddingTop: 44 }}>
          <div className="wrap">
            <div className="frame wide" style={{ maxWidth: 900, margin: "0 auto" }}><img src={post.image.src} alt={post.image.alt} /></div>
            <div className="post rich" style={{ marginTop: 48 }}>
              {post.body.map((s, i) => (
                <div key={i}>
                  {s.heading && <h2>{s.heading}</h2>}
                  {s.paragraphs.map((p, j) => <p key={j}>{p}</p>)}
                  {s.list && s.list.length > 0 && <ul>{s.list.map((it, j) => <li key={j}>{it}</li>)}</ul>}
                </div>
              ))}
            </div>
            <p className="note" style={{ marginTop: 40, maxWidth: 900, marginInline: "auto" }}>
              {b.disclaimer1}<Link href="/legal">{b.legal}</Link>{b.disclaimer2}
            </p>
          </div>
        </section>
      </article>
      <ClosingCTA lang={lang} />
    </>
  );
}
