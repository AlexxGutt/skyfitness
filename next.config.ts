import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const repoName = "skyfitness";

const nextConfig: NextConfig = {
  reactCompiler: true,
  reactStrictMode: false,
  allowedDevOrigins: ["192.168.0.108"],

  output: "export",

  basePath: isProd ? `/${repoName}` : "",
  assetPrefix: isProd ? `/${repoName}` : "",

  images: {
    unoptimized: true,
  },

  trailingSlash: true,
};

export default nextConfig;
