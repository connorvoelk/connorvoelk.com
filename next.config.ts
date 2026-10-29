import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  // Blog posts are written as page.mdx files (see src/app/blog/)
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  // Draft blog posts are hidden on the production site only. Vercel sets
  // VERCEL_ENV at build time, so drafts still show locally and on preview
  // deployments of other branches.
  env: {
    SHOW_DRAFTS: process.env.VERCEL_ENV === "production" ? "false" : "true",
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
