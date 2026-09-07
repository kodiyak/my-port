import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  // Assets de projeto vivem em src/content e são servidos em runtime pelo
  // route handler /projects/[slug]/assets/[asset]. Em deploy serverless
  // (Netlify/Vercel) só arquivos rastreados são empacotados na função; este
  // glob força a inclusão da pasta de assets no artefato da rota.
  outputFileTracingIncludes: {
    "/projects/[slug]/assets/[asset]": ["./src/content/projects/**/*"],
  },
};

const withMDX = createMDX({
  options: {
    jsx: true,
    remarkPlugins: ["remark-gfm"],
    rehypePlugins: [
      [
        "rehype-pretty-code",
        {
          theme: "github-dark",
          keepBackground: false,
        },
      ],
    ],
  },
});

export default withMDX(nextConfig);
