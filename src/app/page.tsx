import Link from "next/link";
import MyPictures from "@/components/me/my-pictures";
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
          <ArrowsDown className="absolute -left-12 bottom-0" />
          <ArrowsDown className="absolute -right-12 bottom-0" />
        </div>
        <MiniTitle
          className="border-t"
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
        <MiniTitle className="border-t">Projects</MiniTitle>
        <ProjectsPosts projects={projects} />
        <MiniTitle className="border-t">Notes</MiniTitle>
        <NotesPosts posts={notes} />
        <MiniTitle className="border-t">Blog</MiniTitle>
        <div className="flex flex-col">
          <BlogPosts posts={posts} />
        </div>
      </main>
    </div>
  );
}
