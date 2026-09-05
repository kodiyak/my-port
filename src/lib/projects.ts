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

export type ProjectImage = {
  name: string;
  width: number;
  height: number;
};

// Formato de imagem suportado pelo grid. Para adicionar outros, basta
// ampliar o conjunto e implementar a leitura de dimensões correspondente.
const SUPPORTED_IMAGE_EXTENSIONS = new Set([".png"]);

const PNG_MAGIC = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

// Lê as dimensões intrínsecas de um PNG direto do cabeçalho (IHDR), sem
// depender de bibliotecas — necessário para o next/image reservar espaço.
async function readPngSize(
  filePath: string,
): Promise<Omit<ProjectImage, "name"> | null> {
  const handle = await fs.open(filePath, "r");
  try {
    const buffer = Buffer.alloc(24);
    const { bytesRead } = await handle.read(buffer, 0, 24, 0);
    if (bytesRead < 24) return null;

    const isPng = PNG_MAGIC.every((byte, i) => buffer[i] === byte);
    const hasIHDR = buffer.toString("ascii", 12, 16) === "IHDR";
    if (!isPng || !hasIHDR) return null;

    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  } finally {
    await handle.close();
  }
}

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

// 2. Lista as imagens de content/projects/<slug>/assets em ordem numérica
// (001.png, 002.png, ..., 010.png), já com as dimensões de cada uma.
export async function getProjectImages(slug: string): Promise<ProjectImage[]> {
  const assetsPath = path.join(PROJECTS_PATH, slug, "assets");

  let files: string[];
  try {
    files = await fs.readdir(assetsPath);
  } catch {
    // Projeto sem pasta de imagens.
    return [];
  }

  const images: ProjectImage[] = [];
  const candidates = files
    .filter((file) =>
      SUPPORTED_IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase()),
    )
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  for (const name of candidates) {
    const size = await readPngSize(path.join(assetsPath, name));
    if (size) images.push({ name, ...size });
  }

  return images;
}
