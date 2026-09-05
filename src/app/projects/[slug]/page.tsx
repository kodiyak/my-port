import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { renderProjectMDX } from "@/lib/mdx";
import { getProject, getProjectImages, getProjects } from "@/lib/projects";
import ScreensGrid from "../_components/screens-grid";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function Page({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;

  try {
    const [project, images, { Component }] = await Promise.all([
      getProject(slug),
      getProjectImages(slug),
      renderProjectMDX(slug),
    ]);

    return (
      <div className="flex flex-col">
        <div className="flex flex-col max-w-xl border-x border-dashed w-full mx-auto">
          <div className="h-14 border-b border-dashed flex items-center px-8">
            <Button
              variant={"outline"}
              render={<Link href={"/"} />}
              nativeButton={false}
            >
              <ArrowLeftIcon />
              <span>Voltar</span>
            </Button>
            <div className="flex-1 border-l px-8 flex items-center">
              <span className="text-xs font-mono"></span>
            </div>
          </div>
          <div className="flex flex-col font-serif gap-2 py-4 px-8">
            <h2 className="text-3xl font-black">{project.name}</h2>
            <p className="text-sm text-muted-foreground font-semibold">
              {project.description}
            </p>
          </div>
        </div>
        {images.length > 0 ? (
          <ScreensGrid
            className="flex flex-row h-124 border-y border-dashed"
            slug={slug}
            name={project.name}
            images={images}
          />
        ) : null}
        <div className="flex flex-col max-w-xl min-h-dvh border-x border-dashed w-full mx-auto">
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
