import fs from "node:fs/promises";
import path from "node:path";
import { MIME_BY_EXTENSION } from "@/lib/assets";
import { PROJECTS_PATH } from "@/lib/content";

// Nome de segmento de URL seguro: evita traversal ("..", "/" etc.).
const SAFE_SEGMENT = /^[a-z0-9][a-z0-9._-]*$/i;

const CACHE_CONTROL =
  process.env.NODE_ENV === "production"
    ? "public, max-age=31536000, immutable"
    : "public, max-age=0, must-revalidate";

// Serve os assets de content/projects/<slug>/assets/<arquivo> no runtime,
// permitindo que o next/image as otimize normalmente e que <video> faça seek
// via HTTP Range (206 Partial Content).
export async function GET(
  request: Request,
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

  let handle: fs.FileHandle | null = null;
  try {
    handle = await fs.open(filePath, "r");
  } catch {
    return new Response("Not found", { status: 404 });
  }

  if (!handle) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const { size } = await handle.stat();

    const baseHeaders: Record<string, string> = {
      "Content-Type": mimeType,
      "Accept-Ranges": "bytes",
      "Cache-Control": CACHE_CONTROL,
    };

    // Suporte a Range (usado por <video> p/ pré-carregar metadata e fazer
    // seek). Range inválido ou multi-range cai no caso abaixo (arquivo inteiro).
    const range = request.headers.get("range");
    const parsedRange = range ? /^bytes=(\d*)-(\d*)$/.exec(range.trim()) : null;

    if (parsedRange) {
      const [, startRaw, endRaw] = parsedRange;
      let start: number;
      let end: number;

      if (startRaw === "") {
        // "bytes=-N": últimos N bytes do arquivo.
        const suffix = Number(endRaw);
        if (!Number.isFinite(suffix) || suffix <= 0 || size === 0) {
          return rangeError(size);
        }
        start = Math.max(size - suffix, 0);
        end = size - 1;
      } else {
        start = Number(startRaw);
        end = endRaw === "" ? size - 1 : Number(endRaw);
        if (
          !Number.isFinite(start) ||
          !Number.isFinite(end) ||
          start < 0 ||
          start >= size ||
          end < start
        ) {
          return rangeError(size);
        }
        if (end >= size) end = size - 1;
      }

      const length = end - start + 1;
      const buffer = Buffer.alloc(length);
      const { bytesRead } = await handle.read(buffer, 0, length, start);
      return new Response(buffer.subarray(0, bytesRead), {
        status: 206,
        headers: {
          ...baseHeaders,
          "Content-Length": String(bytesRead),
          "Content-Range": `bytes ${start}-${end}/${size}`,
        },
      });
    }

    const buffer = await handle.readFile();
    return new Response(buffer, {
      headers: {
        ...baseHeaders,
        "Content-Length": String(buffer.byteLength),
      },
    });
  } finally {
    await handle.close();
  }
}

function rangeError(size: number) {
  return new Response(null, {
    status: 416,
    headers: { "Content-Range": `bytes */${size}` },
  });
}
