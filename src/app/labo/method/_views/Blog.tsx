import Link from "next/link";
import { postsFor } from "@/labo/method/posts";
import { ClosingCTA, PageHero } from "@/components/labo/Sections";
import { mc, lh, type Lang } from "@/labo/method/i18n";

/** The Journal index, in either language (Spanish articles have their own slugs — see posts/es.ts). */
export default function BlogView({ lang }: { lang: Lang }) {
  const t = mc(lang).t, b = t.blog;
  const fmt = new Intl.DateTimeFormat(b.dateLocale, { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
  return (
    <>
      <PageHero eyebrow={b.eyebrow} title={b.title} lede={b.lede} />
      <section style={{ paddingTop: 44 }}>
        <div className="wrap">
          <div className="cards">
            {postsFor(lang).map((p) => (
              <Link key={p.slug} href={lh(lang, `/blog/${p.slug}`)} className="card">
                <div className="img"><img src={p.image.src} alt={p.image.alt} loading="lazy" /></div>
                <div className="cb">
                  <time className="date" dateTime={p.date}>{fmt.format(new Date(p.date))}</time>
                  <h2>{p.title}</h2>
                  <p>{p.excerpt}</p>
                  <span className="more">{t.home.readMore}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <ClosingCTA lang={lang} />
    </>
  );
}
