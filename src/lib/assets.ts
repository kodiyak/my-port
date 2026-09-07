import fs from "node:fs/promises";
import path from "node:path";

// Extensões de imagem/vídeo reconhecidas como assets de projeto.
const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"]);
const VIDEO_EXTENSIONS = new Set([".mp4", ".webm", ".ogv", ".ogg"]);

// Slug seguro de projeto — usado para montar caminhos de fs e URLs sem
// risco de traversal.
const SAFE_SLUG = /^[a-z0-9][a-z0-9._-]*$/i;

// Prefixo reservado para a capa (header) do projeto. Header é IMAGEM apenas:
// qualquer "header-*" que não seja imagem é ignorado pelas buscas (e nunca
// aparece no carrossel de capturas).
const HEADER_PREFIX = "header-";

export type AssetImage = {
  name: string;
  width: number;
  height: number;
};

export type ProjectAssets = {
  /** Capa do projeto: primeiro arquivo "header-*" de imagem (ou null). */
  header: AssetImage | null;
  /** Demais imagens da pasta (capturas numeradas), em ordem numérica. */
  screenshots: AssetImage[];
  /** Nomes dos arquivos de vídeo, em ordem numérica. */
  videos: string[];
};

function isImageFile(name: string) {
  return IMAGE_EXTENSIONS.has(path.extname(name).toLowerCase());
}

function isVideoFile(name: string) {
  return VIDEO_EXTENSIONS.has(path.extname(name).toLowerCase());
}

function isHeaderFile(name: string) {
  return name.toLowerCase().startsWith(HEADER_PREFIX) && isImageFile(name);
}

// Assets de projeto vivem em public/assets/<slug> (estáticos, servidos pelo
// Next/Netlify direto — sem route handler). O slug é o elo com o conteúdo em
// src/content/projects/<slug>/index.mdx.
function assetsDirFor(slug: string) {
  return path.join(process.cwd(), "public", "assets", slug);
}

// URL pública de um asset: /assets/<slug>/<arquivo>.
export function publicAssetUrl(slug: string, name: string) {
  return `/assets/${slug}/${encodeURIComponent(name)}`;
}

// ---- Leitura de dimensões intrínsecas (PNG/JPEG/GIF/WebP) direto do
// cabeçalho, sem dependências — necessário para o next/image reservar espaço.

const PNG_MAGIC = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

// Limite de bytes lidos para descobrir as dimensões (JPEG pode ter segmentos
// APP grandes antes do marcador SOF; 512KB cobre folgadamente).
const MAX_HEADER_BYTES = 512 * 1024;

function parseImageSize(buf: Buffer): Omit<AssetImage, "name"> | null {
  // PNG: assinatura + chunk IHDR no offset 16 (width/height UInt32BE).
  if (
    buf.length >= 24 &&
    PNG_MAGIC.every((byte, i) => buf[i] === byte) &&
    buf.toString("ascii", 12, 16) === "IHDR"
  ) {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }

  // GIF: assinatura + width/height UInt16LE no offset 6.
  const gifSignature = buf.toString("ascii", 0, 6);
  if (gifSignature === "GIF87a" || gifSignature === "GIF89a") {
    return { width: buf.readUInt16LE(6), height: buf.readUInt16LE(8) };
  }

  // JPEG: varre os segmentos até o marcador SOF (C0..CF, exceto C4/C8/CC).
  if (buf.length >= 4 && buf[0] === 0xff && buf[1] === 0xd8) {
    let offset = 2;
    while (offset + 9 <= buf.length) {
      if (buf[offset] !== 0xff) {
        offset += 1;
        continue;
      }
      const marker = buf[offset + 1];
      if (marker === 0xff || marker === 0x00) {
        offset += 1;
        continue;
      }
      // Marcadores sem payload (SOI, EOI, RSTn, TEM).
      if (
        marker === 0xd8 ||
        marker === 0xd9 ||
        marker === 0x01 ||
        (marker >= 0xd0 && marker <= 0xd7)
      ) {
        offset += 2;
        continue;
      }
      const length = buf.readUInt16BE(offset + 2);
      const isSof =
        marker >= 0xc0 &&
        marker <= 0xcf &&
        marker !== 0xc4 &&
        marker !== 0xc8 &&
        marker !== 0xcc;
      if (isSof) {
        if (length < 7) return null;
        return {
          height: buf.readUInt16BE(offset + 5),
          width: buf.readUInt16BE(offset + 7),
        };
      }
      if (length < 2) return null;
      offset += 2 + length;
    }
    return null;
  }

  // WebP: RIFF....WEBP + chunk VP8/VP8L/VP8X.
  if (
    buf.length >= 30 &&
    buf.toString("ascii", 0, 4) === "RIFF" &&
    buf.toString("ascii", 8, 12) === "WEBP"
  ) {
    const chunk = buf.toString("ascii", 12, 16);
    if (chunk === "VP8 " && buf[23] === 0x9d && buf[24] === 0x01 && buf[25] === 0x2a) {
      return {
        width: (buf.readUInt16LE(26) & 0x3fff) + 1,
        height: (buf.readUInt16LE(28) & 0x3fff) + 1,
      };
    }
    if (chunk === "VP8L" && buf.length >= 26 && buf[20] === 0x2f) {
      const bits = buf.readUInt32LE(21);
      return { width: (bits & 0x3fff) + 1, height: ((bits >>> 14) & 0x3fff) + 1 };
    }
    if (chunk === "VP8X") {
      const width = 1 + (buf[24] | (buf[25] << 8) | (buf[26] << 16));
      const height = 1 + (buf[27] | (buf[28] << 8) | (buf[29] << 16));
      return { width, height };
    }
    return null;
  }

  return null;
}

async function readImageSize(
  filePath: string,
): Promise<Omit<AssetImage, "name"> | null> {
  let handle: fs.FileHandle | null = null;
  try {
    handle = await fs.open(filePath, "r");
    const { size } = await handle.stat();
    const buffer = Buffer.alloc(Math.min(size, MAX_HEADER_BYTES));
    const { bytesRead } = await handle.read(buffer, 0, buffer.length, 0);
    return parseImageSize(buffer.subarray(0, bytesRead));
  } catch {
    return null;
  } finally {
    await handle?.close();
  }
}

// Lista e categoriza os assets de public/assets/<slug>:
// - header: primeira imagem "header-*" (a capa do projeto);
// - screenshots: imagens numeradas (001.png, 002.png, ...), que alimentam o
//   carrossel — exclui header-* e vídeos;
// - videos: arquivos de vídeo, para uso explícito no MDX via <AssetVideo>.
export async function getProjectAssets(slug: string): Promise<ProjectAssets> {
  if (!SAFE_SLUG.test(slug)) {
    return { header: null, screenshots: [], videos: [] };
  }

  const dir = assetsDirFor(slug);

  let files: string[] = [];
  try {
    files = await fs.readdir(dir);
  } catch {
    // Projeto sem pasta de assets.
    return { header: null, screenshots: [], videos: [] };
  }

  const headers: string[] = [];
  const screens: string[] = [];
  const videos: string[] = [];
  for (const name of files) {
    if (isHeaderFile(name)) headers.push(name);
    else if (isImageFile(name)) screens.push(name);
    else if (isVideoFile(name)) videos.push(name);
  }

  const numericSort = (a: string, b: string) =>
    a.localeCompare(b, undefined, { numeric: true });
  headers.sort(numericSort);
  screens.sort(numericSort);
  videos.sort(numericSort);

  const toAssetImage = async (name: string): Promise<AssetImage | null> => {
    const size = await readImageSize(path.join(dir, name));
    return size ? { name, ...size } : null;
  };

  let header: AssetImage | null = null;
  for (const name of headers) {
    const image = await toAssetImage(name);
    if (image) {
      header = image;
      break;
    }
  }

  const screenshotResults = await Promise.all(screens.map(toAssetImage));
  return {
    header,
    screenshots: screenshotResults.filter(
      (image): image is AssetImage => image !== null,
    ),
    videos,
  };
}
