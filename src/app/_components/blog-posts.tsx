"use client";

import Link from "next/link";
import { useDisclosure } from "@/lib/hooks/use-disclosure";
import type { PostMetadata } from "@/lib/mdx";
import { cn } from "@/lib/utils";

type GroupedPosts = {
  year: number;
  posts: PostMetadata[];
};

export default function BlogPosts({ posts }: { posts: PostMetadata[] }) {
  const groupedPosts: GroupedPosts[] = posts.reduce((acc, post) => {
    const year = post.date?.getFullYear() ?? 0;
    const group = acc.find((g) => g.year === year);
    if (group) {
      group.posts.push(post);
    } else {
      acc.push({ year, posts: [post] });
    }
    return acc;
  }, [] as GroupedPosts[]);

  const wrapMouseEnter = useDisclosure();

  return (
    <div className="flex flex-col">
      <div
        className="flex flex-col"
        onMouseEnter={wrapMouseEnter.onOpen}
        onMouseLeave={wrapMouseEnter.onClose}
      >
        {groupedPosts.map(({ year, posts }) => (
          <div className="flex border-b" key={`year.${year}`}>
            <div className="w-32 pl-4 pt-2">
              <span className={cn("text-sm font-mono text-muted-foreground")}>
                {year}
              </span>
            </div>
            <div className={cn("flex-1 flex flex-col")}>
              {posts
                .sort(
                  (a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0),
                )
                .map((post) => (
                  <Link
                    key={`post.${post.slug}`}
                    className={cn(
                      "flex h-10 text-sm items-center pr-4 border-b last-of-type:border-b-0",
                      wrapMouseEnter.isOpen
                        ? "text-muted-foreground hover:text-foreground"
                        : "",
                    )}
                    href={post.slug}
                  >
                    <span className={cn("flex-1")}>{post.title}</span>
                    <span>
                      {[
                        post.date?.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        }),
                      ].join(" ")}
                    </span>
                  </Link>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
