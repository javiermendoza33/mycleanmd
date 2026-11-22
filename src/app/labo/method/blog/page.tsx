import Link from "next/link";
import { posts } from "@/labo/method/posts";
import { ClosingCTA, PageHero } from "@/components/labo/Sections";

export const metadata = {
  title: "Journal",
  description: "The evidence behind GLP-1, peptide, testosterone and hormone therapy, and how telehealth hormone care actually works — explained plainly, from The Labo Method.",
  alternates: { canonical: "/blog" },
};

const fmt = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

export default function MethodBlogPage() {
  return (
    <>
      <PageHero eyebrow="The journal" title="The evidence, explained plainly" lede="What the trials actually found, what they didn't, and how the care itself works — before you start anything." />
      <section style={{ paddingTop: 44 }}>
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
      <ClosingCTA />
    </>
  );
}
