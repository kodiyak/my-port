import { renderMDX } from "@/lib/mdx";

export async function MDXRenderer({
  folder,
  slug,
}: {
  folder: string;
  slug: string;
}) {
  const { Component } = await renderMDX(folder, slug);

  return <Component />;
}
