import { notFound } from "next/navigation";
import { getPost, getPosts, renderMDX } from "@/lib/mdx";

export async function generateStaticParams() {
  const posts = await getPosts("blog");
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function Page({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  try {
    const { Component } = await renderMDX(post.type, post.slug);

    return (
      <article className="prose dark:prose-invert max-w-3xl mx-auto py-10 px-4">
        <Component />
      </article>
    );
  } catch (_error) {
    notFound();
  }
}
