import path from "node:path";

// Raiz do conteúdo em texto (MDX) do site.
export const CONTENT_PATH = path.join(process.cwd(), "src", "content");

// Diretório de projetos: src/content/projects/<slug>/index.mdx.
// (Os assets ficam em public/assets/<slug> — o slug é o elo.)
export const PROJECTS_PATH = path.join(CONTENT_PATH, "projects");
