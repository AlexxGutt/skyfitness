import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  reactStrictMode: false,
  allowedDevOrigins: ["192.168.0.108"],
};

export default nextConfig;
