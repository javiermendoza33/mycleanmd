import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, posts } from "@/labo/clinic/posts";
import { BookCta } from "@/components/labo/Clinic";

export const dynamicParams = false;
export function generateStaticParams() { return posts.map((p) => ({ slug: p.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) return {};
  return { title: { absolute: p.seo.title }, description: p.seo.description, alternates: { canonical: `/blog/${p.slug}` }, openGraph: { type: "article", images: [{ url: p.image.src, alt: p.image.alt }] } };
}

const fmt = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  return (
    <>
      <article>
        <header className="pageh" style={{ paddingBottom: 0 }}>
          <div className="wrap posthead">
            <nav className="crumb" aria-label="Breadcrumb"><Link href="/blog">Blog</Link></nav>
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
          </div>
        </section>
      </article>
      <BookCta />
    </>
  );
}
