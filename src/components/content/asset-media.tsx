import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import type { VideoHTMLAttributes } from "react";
import { type AssetImage, publicAssetUrl } from "@/lib/assets";
import { cn } from "@/lib/utils";

// Índice de assets de um projeto — usado para resolver <AssetImage>/<AssetVideo>
// escritos no MDX para o arquivo físico e as dimensões reais.
export type AssetIndex = {
  slug: string;
  /** Todas as imagens do projeto (header-* + capturas). */
  images: AssetImage[];
  /** Nomes dos arquivos de vídeo do projeto. */
  videos: string[];
};

const DEFAULT_SIZES = "(max-width: 640px) 100vw, 640px";

// Cria os componentes de mídia com o contexto do projeto: valida o nome do
// asset, resolve a URL pública e injeta as dimensões reais no next/image.
export function createAssetMDXComponents(index: AssetIndex): MDXComponents {
  const imagesByName = new Map(
    index.images.map((image) => [image.name, image]),
  );
  const videos = new Set(index.videos);

  const listImages = () =>
    index.images.length > 0
      ? index.images.map((image) => image.name).join(", ")
      : "(nenhuma imagem)";
  const listVideos = () =>
    videos.size > 0 ? [...videos].join(", ") : "(nenhum vídeo)";

  function basename(src: string) {
    const withoutQuery = src.split(/[?#]/)[0] ?? src;
    return withoutQuery.split("/").pop() ?? "";
  }

  function resolveImageName(src: string) {
    const name = basename(src);
    const image = imagesByName.get(name);
    if (!image) {
      throw new Error(
        `[AssetImage] "${src}" não é uma imagem de public/assets/${index.slug}/. ` +
          `Disponíveis: ${listImages()}`,
      );
    }
    return image;
  }

  function AssetImage({
    src,
    alt = "",
    caption,
    className,
    sizes = DEFAULT_SIZES,
    priority = false,
  }: {
    src: string;
    alt?: string;
    caption?: string;
    className?: string;
    sizes?: string;
    priority?: boolean;
  }) {
    const image = resolveImageName(src);
    return (
      <figure className={cn("my-4 flex flex-col gap-1", className)}>
        <Image
          src={publicAssetUrl(index.slug, image.name)}
          alt={alt}
          width={image.width}
          height={image.height}
          sizes={sizes}
          priority={priority}
          className="w-full h-auto border-y border-dashed object-contain"
        />
        {caption ? (
          <figcaption className="px-1 text-xs font-mono text-muted-foreground">
            {caption}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  function AssetVideo({
    src,
    poster,
    caption,
    className,
    ...videoProps
  }: VideoHTMLAttributes<HTMLVideoElement> & {
    src: string;
    poster?: string;
    caption?: string;
  }) {
    const name = basename(src);
    if (!videos.has(name)) {
      throw new Error(
        `[AssetVideo] "${src}" não é um vídeo de public/assets/${index.slug}/. ` +
          `Disponíveis: ${listVideos()}`,
      );
    }

    let posterUrl: string | undefined;
    if (poster) {
      const posterName = basename(poster);
      const image = imagesByName.get(posterName);
      if (!image) {
        throw new Error(
          `[AssetVideo poster] "${poster}" não é uma imagem de public/assets/${index.slug}/. ` +
            `Disponíveis: ${listImages()}`,
        );
      }
      posterUrl = publicAssetUrl(index.slug, posterName);
    }

    return (
      <figure className={cn("my-4 flex flex-col -mx-8", className)}>
        <video
          src={publicAssetUrl(index.slug, name)}
          poster={posterUrl}
          controls
          preload="metadata"
          playsInline
          className="w-full h-auto border-y border-dashed bg-background"
          {...videoProps}
        />
        {caption ? (
          <figcaption className="px-8 py-2 border-b border-dashed text-xs font-mono text-muted-foreground">
            {caption}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  // Markdown puro (![alt](src)) dentro do MDX de projeto: passa pelo mesmo
  // resolver do <AssetImage> — next/image com dimensões reais lidas do disco.
  function MarkdownImage({
    src,
    alt = "",
    className,
  }: {
    src?: string;
    alt?: string;
    className?: string;
  }) {
    if (!src) return null;
    const image = resolveImageName(src);
    return (
      <Image
        src={publicAssetUrl(index.slug, image.name)}
        alt={alt}
        width={image.width}
        height={image.height}
        sizes={DEFAULT_SIZES}
        className={cn(
          "w-full h-auto my-2 border-y border-dashed object-contain",
          className,
        )}
      />
    );
  }

  return { AssetImage, AssetVideo, img: MarkdownImage };
}
