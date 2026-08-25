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
          className="px-2 py-2 group flex flex-col hover:underline"
        >
          <div className="flex items-center gap-2">
            <ArrowRightIcon className="opacity-0 size-3.5 group-hover:opacity-100" />
            <span className="text-sm font-medium">{post.title}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
