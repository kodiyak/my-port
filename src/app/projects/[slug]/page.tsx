import Image from "next/image";
import { notFound } from "next/navigation";
import { getProjectAssets, publicAssetUrl } from "@/lib/assets";
import { renderProjectMDX } from "@/lib/mdx";
import { getProject, getProjects } from "@/lib/projects";
import { cn } from "@/lib/utils";
import ScreensGrid from "../_components/screens-grid";

const CONTENT_CLASSNAME =
  "flex flex-col max-w-xl border-x border-dashed w-full mx-auto";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function Page({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;

  try {
    const [project, assets, { Component }] = await Promise.all([
      getProject(slug),
      getProjectAssets(slug),
      renderProjectMDX(slug),
    ]);
    const { header, screenshots } = assets;

    return (
      <div className="flex flex-col">
        <div className={cn("w-full h-[60vh] relative border-dashed")}>
          {header ? (
            <Image
              src={publicAssetUrl(slug, header.name)}
              alt={`${project.name} — capa`}
              width={header.width}
              height={header.height}
              sizes="100vw"
              priority
              className="size-full object-cover absolute z-10"
            />
          ) : null}
          <div className="absolute bottom-0 left-0 w-full z-20 bg-linear-to-b from-transparent to-background pt-32">
            <div className="flex flex-col font-serif gap-3 py-4 px-8">
              <h2 className="text-5xl">{project.name}</h2>
              <p className="text-2xl font-light text-muted-foreground">
                {project.description}
              </p>
            </div>
          </div>
        </div>
        {screenshots.length > 0 ? (
          <ScreensGrid
            className="flex flex-row h-124 border-y border-dashed"
            slug={slug}
            name={project.name}
            images={screenshots}
          />
        ) : null}
        <div className={cn(CONTENT_CLASSNAME)}>
          <article className="flex flex-col font-serif p-8">
            <Component />
          </article>
        </div>
      </div>
    );
  } catch (_error) {
    notFound();
  }
}
