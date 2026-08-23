import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LANGUAGES } from "@/lib/config";
import { getPosts } from "@/lib/mdx";

export default async function Home() {
  const posts = await getPosts("blog");

  return (
    <div className="flex flex-col">
      <main className="w-full mx-auto max-w-xl">
        <div className="p-2 rounded-xl">
          {LANGUAGES.map((lang) => (
            <Button
              key={`lang.${lang}`}
              variant={"ghost"}
              size={"xs"}
              className={"font-mono"}
            >
              {lang}
            </Button>
          ))}
        </div>
        <div className="flex flex-col">
          {posts.map((post) => (
            <div key={`post.${post.slug}`}>
              <Link href={`/${post.slug}`}>{post.title}</Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
