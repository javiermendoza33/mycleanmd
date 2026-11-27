import type { Metadata } from "next";
import { routeSlugs } from "@/labo/method/posts";
import PostView, { postMetadata } from "../../../_views/Post";

export const dynamicParams = false;
export function generateStaticParams() { return routeSlugs("es").map((slug) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return postMetadata("es", (await params).slug);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  return <PostView lang="es" slug={(await params).slug} />;
}
