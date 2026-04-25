import type { NextConfig } from "next";
import path from "path";

const monorepoRoot = path.resolve(__dirname, "../../..");

const nextConfig: NextConfig = {
  outputFileTracingRoot: monorepoRoot,
  sassOptions: {
    implementation: require.resolve("sass"),
  },
  turbopack: {
    root: monorepoRoot,
    resolveAlias: {
      "@swc/helpers": path.join(monorepoRoot, "node_modules/@swc/helpers"),
    },
  },
};

export default nextConfig;
