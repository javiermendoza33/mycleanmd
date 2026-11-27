import type { Metadata } from "next";
import { routeSlugs } from "@/labo/method/posts";
import PostView, { postMetadata } from "../../_views/Post";

export const dynamicParams = false;
export function generateStaticParams() { return routeSlugs("en").map((slug) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return postMetadata("en", (await params).slug);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  return <PostView lang="en" slug={(await params).slug} />;
}
