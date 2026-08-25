import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getPost, getPosts, renderMDX } from "@/lib/mdx";

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
        <div className="flex flex-col max-w-xl min-h-dvh border-x w-full mx-auto">
          <div className="h-14 border-b flex items-center px-8">
            <Button variant={"outline"} render={<Link href={"/"} />}>
              <ArrowLeftIcon />
              <span>Voltar</span>
            </Button>
            <div className="flex-1 border-l px-8 flex items-center">
              <span className="text-xs font-mono"></span>
            </div>
          </div>
          <div className="flex flex-col font-serif gap-2 py-4 px-8">
            <h2 className="text-3xl font-black">{post.title}</h2>
            <p className="text-sm text-muted-foreground font-semibold">
              {post.description}
            </p>
          </div>
          <Separator />
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
