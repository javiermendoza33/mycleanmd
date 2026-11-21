import Link from "next/link";
import { posts } from "@/labo/clinic/posts";
import { BookCta } from "@/components/labo/Clinic";
import { PageHero } from "@/components/labo/Sections";

export const metadata = {
  title: "Blog",
  description: "Skincare and wellness insights from The Labo Clinic in Seattle, WA — Botox, fillers, IV therapy, chemical peels and more.",
  alternates: { canonical: "/blog" },
};

const fmt = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

export default function BlogPage() {
  return (
    <>
      <PageHero eyebrow="The journal" title="Skincare & wellness insights" />
      <section style={{ paddingBlock: 0 }}>
        <div className="wrap"><div className="band" style={{ marginTop: 28 }}><img src="/labo/img/misc/blog.jpg" alt="Close-up of a woman with fresh, glowing skin" /></div></div>
      </section>
      <section style={{ paddingTop: 36 }}>
        <div className="wrap">
          <div className="cards">
            {posts.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="card">
                <div className="img"><img src={p.image.src} alt={p.image.alt} loading="lazy" /></div>
                <div className="cb">
                  <time className="date" dateTime={p.date}>{fmt.format(new Date(p.date))}</time>
                  <h2>{p.title}</h2>
                  <p>{p.excerpt}</p>
                  <span className="more">Read more</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <BookCta />
    </>
  );
}
