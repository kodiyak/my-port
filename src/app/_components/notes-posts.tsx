import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import type { PostMetadata } from "@/lib/mdx";

export default function NotesPosts({ posts }: { posts: PostMetadata[] }) {
  return (
    <div className="grid grid-cols-2">
      {posts.map((post) => (
        <Link
          href={post.slug}
          key={`post.${post.slug}`}
          className="px-4 py-2 group flex flex-col text-muted-foreground hover:text-foreground"
        >
          <div className="flex items-start gap-2">
            <ArrowRightIcon className="opacity-0 relative top-1 size-3.5 -translate-x-5.5 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
            <div className="flex flex-1 flex-col gap-1">
              <span className="text-sm font-medium -translate-x-5.5 group-hover:translate-x-0 transition-all duration-300">
                {post.title}
              </span>
              <span className="text-[10px] text-foreground font-medium -translate-x-5.5 opacity-20 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                {post.description ?? "-"}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
