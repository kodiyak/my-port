import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { ProjectImage } from "@/lib/projects";
import { cn } from "@/lib/utils";

// Grid das capturas do projeto. As imagens são descobertas automaticamente
// da pasta content/projects/<slug>/assets e exibidas em ordem numérica.
export default function ScreensGrid({
  slug,
  name,
  images,
  className,
}: {
  slug: string;
  name: string;
  images: ProjectImage[];
  className?: string;
}) {
  return (
    <Carousel className={cn(className)}>
      <CarouselContent className="size-full">
        {images.map((image) => (
          <CarouselItem
            key={image.name}
            className="basis-1/5 py-0 px-4 border-r border-dashed last:border-r-0 last:pr-0 last:pl-4"
          >
            <Image
              src={`/projects/${slug}/assets/${image.name}`}
              alt={`${name} — captura ${image.name.replace(/\.\w+$/, "")}`}
              width={image.width}
              height={image.height}
              sizes="(max-width: 640px) 50vw, 320px"
              loading="lazy"
              className="h-full object-contain object-center"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="absolute -bottom-12 right-4 flex items-center z-20">
        <CarouselPrevious className="relative right-0 left-0 translate-x-0 translate-y-0 rotate-0 border-0 rounded-none" />
        <CarouselNext className="relative right-0 left-0 translate-x-0 translate-y-0 rotate-0 border-0 rounded-none" />
      </div>
    </Carousel>
  );
}
