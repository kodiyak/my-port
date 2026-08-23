import fs from "node:fs/promises";
import path from "node:path";
import { evaluate } from "@mdx-js/mdx";
import matter from "gray-matter";
import * as runtime from "react/jsx-runtime";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import { z } from "zod";

const POST_TYPES = ["blog", "notes"] as const;
export type PostType = (typeof POST_TYPES)[number];

const PostMetadataSchema = z.looseObject({
  slug: z.string(),
  title: z.string(),
  date: z
    .string()
    .optional()
    .transform((date) => (date ? new Date(date) : undefined)),
  description: z.string().optional(),
  type: z.enum(POST_TYPES),
});
export type PostMetadata = z.infer<typeof PostMetadataSchema>;

const CONTENT_PATH = path.join(process.cwd(), "src", "content");

// 1. Lista todos os posts de uma pasta específica ('blog' ou 'notes')
export async function getPosts(folder: PostType): Promise<PostMetadata[]> {
  const dirPath = path.join(CONTENT_PATH, folder);

  try {
    const files = await fs.readdir(dirPath);
    const mdxFiles = files.filter((file) => file.endsWith(".mdx"));

    const posts = await Promise.all(
      mdxFiles.map(async (fileName) => {
        const filePath = path.join(dirPath, fileName);
        const fileContent = await fs.readFile(filePath, "utf-8");
        const { data } = matter(fileContent);

        return PostMetadataSchema.parse({
          slug: fileName.replace(/\.mdx$/, ""),
          title: data.title || "Sem título",
          date: data.date,
          description: data.description,
          type: folder,
          ...data,
        });
      }),
    );

    // Ordena do mais recente para o mais antigo
    return posts.sort(
      (a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0),
    );
  } catch (error) {
    return [];
  }
}

export async function getPost(slug: string) {
  const [posts, notes] = await Promise.all([
    getPosts("blog"),
    getPosts("notes"),
  ]);

  const allPosts = [...posts, ...notes];
  const post = allPosts.find((p) => p.slug === slug);

  if (!post) {
    throw new Error(`Post with slug "${slug}" not found.`);
  }

  return post;
}

export async function renderMDX(folder: string, slug: string) {
  const filePath = path.join(
    process.cwd(),
    "src/content",
    folder,
    `${slug}.mdx`,
  );
  const fileContent = await fs.readFile(filePath, "utf-8");
  const { content, data } = matter(fileContent);

  const { default: MDXComponent } = await evaluate(content, {
    ...runtime,
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      [
        rehypePrettyCode,
        {
          theme: "github-dark",
          keepBackground: false,
        },
      ],
    ],
  });

  return {
    Component: MDXComponent,
    frontmatter: data,
  };
}
