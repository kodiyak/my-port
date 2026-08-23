import Link from "next/link";
import { getPosts } from "@/lib/mdx";
import BlogPosts from "./_components/blog-posts";
import Intro from "./_components/intro";
import { MiniTitle } from "./_components/shared";

export default async function Home() {
  const posts = await getPosts("blog");

  return (
    <div className="flex flex-col">
      <main className="w-full mx-auto border-x min-h-dvh max-w-xl">
        <MiniTitle>Intro</MiniTitle>
        <Intro />
        <MiniTitle className="border-t">Blog</MiniTitle>
        <div className="flex flex-col">
          {/* {posts.map((post) => (
            <div key={`post.${post.slug}`}>
              <Link href={`/${post.slug}`}>{post.title}</Link>
            </div>
          ))} */}
          <BlogPosts posts={posts} />
        </div>
      </main>
    </div>
  );
}
