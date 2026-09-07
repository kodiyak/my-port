import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPost, getPosts, renderMDX } from "@/lib/mdx";

export async function generateMetadata({
  params,
}: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = await getPost(slug);
    return {
      title: post.title,
      description: post.description,
      openGraph: {
        type: "article",
        title: post.title,
        description: post.description,
        publishedTime: post.date?.toISOString(),
      },
    };
  } catch {
    return {};
  }
}

export async function generateStaticParams() {
  const [blog, notes] = await Promise.all([
    getPosts("blog"),
    getPosts("notes"),
  ]);
  return [...blog, ...notes].map((post) => ({ slug: post.slug }));
}

export default async function Page({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;

  try {
    const post = await getPost(slug);
    const { Component } = await renderMDX(post.type, post.slug);

    return (
      <div className="flex flex-col">
        <div className="flex flex-col max-w-xl min-h-dvh border-x border-dashed w-full mx-auto">
          <div className="flex flex-col font-serif gap-2 py-4 px-8">
            <h2 className="text-3xl font-black">{post.title}</h2>
            <p className="text-sm text-muted-foreground font-semibold">
              {post.description}
            </p>
          </div>
          <div className="border-b border-dashed" />
          <article className="flex flex-col font-serif p-8">
            <Component />
          </article>
        </div>
      </div>
    );
  } catch (_error) {
    notFound();
  }
}
