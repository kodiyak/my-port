import type { MDXComponents } from "mdx/types";
import Image, { type ImageProps } from "next/image";
import Link from "next/link";
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
    h1: (props) => <h1 className="text-xl mb-2 font-bold" {...props} />,
    h2: (props) => <h2 className="text-lg mb-2 font-bold" {...props} />,
    h3: (props) => <h3 className="text-base mb-2 font-bold" {...props} />,
    p: (props) => <p className="min-h-6 text-sm" {...props} />,
    hr: (props) => (
      <div className="px-8 py-6">
        <Separator {...props} />
      </div>
    ),
    ...components,
  };
}
