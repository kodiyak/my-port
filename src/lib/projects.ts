import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import { getProjectAssets, type AssetImage } from "@/lib/assets";
import { PROJECTS_PATH } from "@/lib/content";

const ProjectSchema = z.object({
  slug: z.string(),
  name: z.string(),
  description: z.string().optional(),
});
export type Project = z.infer<typeof ProjectSchema>;

// Reexporta o shape de imagem usado pela UI (ScreensGrid etc.) e o agregado
// completo de assets do projeto (capa + capturas + vídeos).
export type { AssetImage as ProjectImage } from "@/lib/assets";
export type { ProjectAssets } from "@/lib/assets";

// 1. Lista os projetos: cada subpasta de content/projects com um index.mdx.
export async function getProjects(): Promise<Project[]> {
  const projects: Project[] = [];

  try {
    const entries = await fs.readdir(PROJECTS_PATH, { withFileTypes: true });
    const folders = entries.filter((entry) => entry.isDirectory());

    for (const folder of folders) {
      try {
        const indexPath = path.join(PROJECTS_PATH, folder.name, "index.mdx");
        const { data } = matter(await fs.readFile(indexPath, "utf-8"));
        projects.push(
          ProjectSchema.parse({
            slug: folder.name,
            name: data.name,
            description: data.description,
          }),
        );
      } catch {
        // Pasta sem index.mdx válido não é um projeto.
      }
    }
  } catch {
    return [];
  }

  return projects.sort((a, b) => a.slug.localeCompare(b.slug));
}

export async function getProject(slug: string): Promise<Project> {
  const project = (await getProjects()).find((item) => item.slug === slug);
  if (!project) {
    throw new Error(`Project with slug "${slug}" not found.`);
  }
  return project;
}

// 2. Capturas do projeto (imagens numeradas, sem a capa header-* e sem
// vídeos) em ordem numérica, já com as dimensões de cada uma — é o conteúdo
// do carrossel/ScreensGrid.
export async function getProjectImages(slug: string): Promise<AssetImage[]> {
  return (await getProjectAssets(slug)).screenshots;
}
