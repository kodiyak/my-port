import Link from "next/link";
import { getPosts } from "@/lib/mdx";
import BlogPosts from "./_components/blog-posts";
import Intro from "./_components/intro";
import NotesPosts from "./_components/notes-posts";
import { MiniTitle } from "./_components/shared";

export default async function Home() {
  // const posts = await getPosts("blog");
  // const notes = await getPosts("notes");

  const [posts, notes] = await Promise.all([
    getPosts("blog"),
    getPosts("notes"),
  ]);

  return (
    <div className="flex flex-col">
      <main className="w-full mx-auto border-x min-h-dvh max-w-xl">
        <MiniTitle>Intro</MiniTitle>
        <Intro />
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
