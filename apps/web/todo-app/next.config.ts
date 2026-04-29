import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

const monorepoRoot = path.resolve(__dirname, "../../..");

const nextConfig: NextConfig = {
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
