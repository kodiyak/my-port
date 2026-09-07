import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";

export function getMDXComponents(components: MDXComponents): MDXComponents {
  return {
    a: ({ href, children, ...props }) => (
      <Link
        href={href || "#"}
        className="font-normal text-muted-foreground hover:text-foreground underline"
        target={"_blank"}
        {...props}
      >
        {children}
      </Link>
    ),
    h1: (props) => <h1 className="text-xl mt-6 mb-2 font-bold" {...props} />,
    h2: (props) => <h2 className="text-lg mt-5 mb-2 font-bold" {...props} />,
    h3: (props) => <h3 className="text-base mt-4 mb-2 font-bold" {...props} />,
    p: (props) => (
      <p className="min-h-6 font-light text-base mb-2" {...props} />
    ),
    b: (props) => <b className="font-bold" {...props} />,
    strong: (props) => <strong className="font-semibold" {...props} />,
    pre: (props) => (
      <pre
        className={cn(
          "bg-background font-mono text-muted-foreground text-sm mt-2 mb-6 -mx-8 py-2 px-8 overflow-x-auto",
          "border-y border-dashed",
        )}
        {...props}
      />
    ),
    li: (props) => (
      <li
        className={cn("text-base font-light", "list-disc list-inside")}
        {...props}
      />
    ),
    hr: (props) => (
      <div className="px-8 py-6">
        <Separator {...props} />
      </div>
    ),
    blockquote: (props) => (
      <blockquote
        className="border-l-2 text-muted-foreground pl-4 mb-4 italic [&_p]:text-sm!"
        {...props}
      />
    ),
    ...components,
  };
}
