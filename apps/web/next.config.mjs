import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

// Variables de entorno centralizadas en un único .env.local en la raíz del monorepo.
const rootEnvPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../.env.local");
if (existsSync(rootEnvPath)) {
  process.loadEnvFile(rootEnvPath);
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@paxo/ui", "@paxo/shared", "@paxo/database"],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**.supabase.co" }],
  },
};

export default nextConfig;
