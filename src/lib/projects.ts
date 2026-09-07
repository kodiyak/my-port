import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import { PROJECTS_PATH } from "@/lib/content";

const ProjectSchema = z.object({
  slug: z.string(),
  name: z.string(),
  description: z.string().optional(),
});
export type Project = z.infer<typeof ProjectSchema>;

// Lista os projetos: cada subpasta de content/projects com um index.mdx.
// Os assets de cada um ficam em public/assets/<slug> e são resolvidos por
// getProjectAssets() em @/lib/assets.
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
