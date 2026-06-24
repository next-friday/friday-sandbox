import { createMDX } from "fumadocs-mdx/next";

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  transpilePackages: ["@friday-sandbox/react", "@friday-sandbox/styles"],
};

const withMDX = createMDX();

export default withMDX(config);
