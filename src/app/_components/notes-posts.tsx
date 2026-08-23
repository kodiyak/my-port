import type { PostMetadata } from "@/lib/mdx";
import { arrayChunk } from "@/lib/utils";

export default function NotesPosts({ posts }: { posts: PostMetadata[] }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {posts.map((post) => (
        <div
          key={`post.${post.slug}`}
          className="p-4 flex flex-col hover:underline"
        >
          <span className="text-sm font-medium">{post.title}</span>
          <p className="text-xs text-muted-foreground">
            {post.description ?? "-"}
          </p>
        </div>
      ))}
    </div>
  );
}
