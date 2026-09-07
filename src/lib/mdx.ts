import fs from "node:fs/promises";
import path from "node:path";
import { evaluate } from "@mdx-js/mdx";
import matter from "gray-matter";
import type { MDXComponents } from "mdx/types";
import * as runtime from "react/jsx-runtime";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import { z } from "zod";
import { createAssetMDXComponents } from "@/components/content/asset-media";
import { getMDXComponents } from "@/components/mdx-components";
import { getProjectAssets } from "@/lib/assets";
import { CONTENT_PATH, PROJECTS_PATH } from "@/lib/content";

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
  order: z.number().optional(),
});
export type PostMetadata = z.infer<typeof PostMetadataSchema>;

// Extrai o slug do nome do arquivo, ignorando o prefixo numérico de ordenação.
// Ex.: "001-manifest.mdx" -> "manifest"; "first-post.mdx" -> "first-post".
function slugFromFileName(fileName: string): string {
  return fileName.replace(/\.mdx$/, "").replace(/^\d+-/, "");
}

// Extrai a ordem do prefixo numérico do arquivo. Ex.: "001-manifest.mdx" -> 1.
// Retorna undefined para arquivos sem prefixo.
function fileOrder(fileName: string): number | undefined {
  const match = fileName.match(/^(\d+)-/);
  return match ? Number(match[1]) : undefined;
}

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
          slug: slugFromFileName(fileName),
          order: fileOrder(fileName),
          title: data.title || "Sem título",
          date: data.date,
          description: data.description,
          type: folder,
          ...data,
        });
      }),
    );

    // Arquivos com prefixo numérico primeiro (em ordem), depois por data (mais recente primeiro).
    return posts.sort((a, b) => {
      const orderDiff =
        (a.order ?? Number.MAX_SAFE_INTEGER) -
        (b.order ?? Number.MAX_SAFE_INTEGER);
      if (orderDiff !== 0) return orderDiff;
      return (b.date?.getTime() || 0) - (a.date?.getTime() || 0);
    });
  } catch (_error) {
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

// Avalia um source MDX com a mesma configuração de componentes, remark e
// rehype usada em todo o site. `components` são os componentes extras
// disponíveis para tags customizadas (ex.: <AssetImage>/<AssetVideo>).
async function evaluateMDX(source: string, components: MDXComponents = {}) {
  const { default: MDXComponent } = await evaluate(source, {
    ...runtime,
    useMDXComponents: () => getMDXComponents(components),
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

  return MDXComponent;
}

export async function renderMDX(folder: string, slug: string) {
  const dirPath = path.join(CONTENT_PATH, folder);

  // Resolve o arquivo real: busca o slug limpo no diretório (funciona com e
  // sem prefixo numérico, ex.: "manifest" -> "001-manifest.mdx").
  const files = await fs.readdir(dirPath);
  const fileName = files.find(
    (file) => file.endsWith(".mdx") && slugFromFileName(file) === slug,
  );

  if (!fileName) {
    throw new Error(`MDX file for slug "${slug}" not found in "${folder}".`);
  }

  const filePath = path.join(dirPath, fileName);
  const fileContent = await fs.readFile(filePath, "utf-8");
  const { content, data } = matter(fileContent);

  return {
    Component: await evaluateMDX(content),
    frontmatter: data,
  };
}

// Renderiza o index.mdx de um projeto (content/projects/<slug>/index.mdx),
// com os componentes de mídia (<AssetImage>/<AssetVideo>) resolvidos para os
// assets reais de public/assets/<slug>.
export async function renderProjectMDX(slug: string) {
  const filePath = path.join(PROJECTS_PATH, slug, "index.mdx");
  const fileContent = await fs.readFile(filePath, "utf-8");
  const { content, data } = matter(fileContent);

  const assets = await getProjectAssets(slug);
  const mdxComponents = createAssetMDXComponents({
    slug,
    images: assets.header
      ? [assets.header, ...assets.screenshots]
      : assets.screenshots,
    videos: assets.videos,
  });

  return {
    Component: await evaluateMDX(content, mdxComponents),
    frontmatter: data,
  };
}
