import { DownloadIcon } from "lucide-react";
import Link from "next/link";
import MyPictures from "@/components/me/my-pictures";
import { Button } from "@/components/ui/button";
import { getPosts } from "@/lib/mdx";
import { getProjects } from "@/lib/projects";
import ArrowsDown from "./_components/arrows-down";
import BlogPosts from "./_components/blog-posts";
import Intro from "./_components/intro";
import NotesPosts from "./_components/notes-posts";
import ProjectsPosts from "./_components/projects-posts";
import { MiniTitle } from "./_components/shared";

export default async function Home() {
  const [posts, notes, projects] = await Promise.all([
    getPosts("blog"),
    getPosts("notes"),
    getProjects(),
  ]);

  return (
    <div className="flex flex-col flex-1">
      <main className="w-full mx-auto border-x border-dashed min-h-dvh max-w-xl">
        <MiniTitle>Intro</MiniTitle>
        <div className="relative">
          <Intro />
          <div className="h-18 md:hidden"></div>
          <ArrowsDown className="absolute left-4 md:-left-12 bottom-0" />
          <ArrowsDown className="absolute right-4 md:-right-12 bottom-0" />
        </div>
        <div className="flex h-10 border-t border-dashed">
          <div className="flex items-center gap-3 text-muted-foreground h-full border-r border-dashed px-6">
            <DownloadIcon className="size-3.5" />
            <span className="text-xs">Baixar Curriculo</span>
          </div>
          {[
            {
              label: "PDF",
              href: "/resume.pdf",
            },
            {
              label: "DOCX",
              href: "/resume.docx",
            },
          ].map((item) => (
            <Button
              key={item.label}
              variant={"outline"}
              nativeButton={false}
              className={
                "h-full border-0 border-r border-dashed border-border dark:border-border rounded-none flex-1 bg-transparent dark:bg-transparent last:border-r-0"
              }
              render={<Link href={item.href} download />}
            >
              <span className="text-xs">{item.label}</span>
            </Button>
          ))}
        </div>
        <MiniTitle
          className="border-t border-dashed"
          actions={
            <Link
              className="text-[10px] font-mono font-semibold text-muted-foreground hover:text-foreground hover:underline"
              href={"https://www.instagram.com/math_gfx"}
              target={"_blank"}
              rel="noopener noreferrer"
            >
              instagram.com
            </Link>
          }
        >
          Pictures
        </MiniTitle>
        <MyPictures />
        <MiniTitle className="border-t border-dashed">Projects</MiniTitle>
        <ProjectsPosts projects={projects} />
        <MiniTitle className="border-t border-dashed">Notes</MiniTitle>
        <NotesPosts posts={notes} />
        <MiniTitle className="border-t border-dashed">Blog</MiniTitle>
        <div className="flex flex-col">
          <BlogPosts posts={posts} />
        </div>
      </main>
    </div>
  );
}
