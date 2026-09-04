import type { MDXComponents } from "mdx/types";
import Image, { type ImageProps } from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";

export function getMDXComponents(components: MDXComponents): MDXComponents {
  return {
    a: ({ href, children, ...props }) => (
      <Link href={href || "#"} {...props}>
        {children}
      </Link>
    ),
    img: (props) => (
      <Image
        sizes="100vw"
        style={{ width: "100%", height: "auto" }}
        {...(props as ImageProps)}
      />
    ),
    h1: (props) => <h1 className="text-base mt-6 mb-2 font-bold" {...props} />,
    h2: (props) => <h2 className="text-base mt-5 mb-2 font-bold" {...props} />,
    h3: (props) => <h3 className="text-base mt-4 mb-2 font-bold" {...props} />,
    p: (props) => <p className="min-h-6 text-xs" {...props} />,
    li: (props) => (
      <li className={cn("text-sm ", "list-disc list-inside")} {...props} />
    ),
    hr: (props) => (
      <div className="px-8 py-6">
        <Separator {...props} />
      </div>
    ),
    blockquote: (props) => (
      <blockquote
        className="border-l-2 text-muted-foreground pl-4 text-sm mb-4 italic"
        {...props}
      />
    ),
    ...components,
  };
}
