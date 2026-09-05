import fs from "node:fs/promises";
import path from "node:path";
import { PROJECTS_PATH } from "@/lib/content";

const MIME_BY_EXTENSION: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

// Nome de segmento de URL seguro: evita traversal ("..", "/" etc.).
const SAFE_SEGMENT = /^[a-z0-9][a-z0-9._-]*$/i;

// Serve os assets de content/projects/<slug>/assets/<arquivo> no runtime,
// permitindo que a página do projeto liste e exiba as imagens sem
// hardcode e que o next/image as otimize normalmente.
export async function GET(
  _request: Request,
  ctx: RouteContext<"/projects/[slug]/assets/[asset]">,
) {
  const { slug, asset } = await ctx.params;

  const extension = path.extname(asset).toLowerCase();
  const mimeType = MIME_BY_EXTENSION[extension];
  const isSafe = SAFE_SEGMENT.test(slug) && SAFE_SEGMENT.test(asset);

  if (!isSafe || !mimeType) {
    return new Response("Not found", { status: 404 });
  }

  const filePath = path.join(PROJECTS_PATH, slug, "assets", asset);

  try {
    const buffer = await fs.readFile(filePath);
    const cacheControl =
      process.env.NODE_ENV === "production"
        ? "public, max-age=31536000, immutable"
        : "public, max-age=0, must-revalidate";

    return new Response(buffer, {
      headers: {
        "Content-Type": mimeType,
        "Content-Length": String(buffer.byteLength),
        "Cache-Control": cacheControl,
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
