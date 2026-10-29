import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import fs from "fs";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import type { IncomingMessage, ServerResponse } from "http";

// --- CONFIGURATION MANAGEMENT ---
const resolvePath = (p: string) => path.resolve(__dirname, p);

interface AssetMap {
  virtualRoute: string; // The URL sub-path the browser requests
  srcDir: string; // Physical source location in workspace
  distDir: string; // Physical target location in production build
  files: string[]; // List of specific assets to track
  contentType: string; // HTTP header content-type for dev server
}

const PROLOG_ASSET_MANIFEST: AssetMap[] = [
  {
    virtualRoute: "/prolog/",
    srcDir: resolvePath("prolog"),
    distDir: resolvePath("dist/prolog"),
    files: [
      "rules.pl",
      "domain/scheduler_domain.pl",
      "adapters/schedule_io.pl",
    ],
    contentType: "text/plain",
  },
];

const serveStaticFile = (
  response: ServerResponse<IncomingMessage>,
  filePath: string,
  contentType: string,
): boolean => {
  if (fs.existsSync(filePath)) {
    response.setHeader("Content-Type", contentType);
    response.end(fs.readFileSync(filePath));
    return true;
  }
  return false;
};

const copySingleAsset = (srcDir: string, destDir: string, file: string) => {
  const targetPath = path.join(destDir, file);
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.copyFileSync(path.join(srcDir, file), targetPath);
};

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    {
      name: "serve-and-build-prolog",

      // 1. Local Development (Declarative Lookup)
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (!req.url) return next();

          const matched = PROLOG_ASSET_MANIFEST.find((asset) => {
            const routeIndex = req.url!.indexOf(asset.virtualRoute);
            if (routeIndex < 0) return false;
            const relativePath = req
              .url!.slice(routeIndex + asset.virtualRoute.length)
              .split("?")[0];
            return asset.files.includes(relativePath);
          });

          if (!matched) return next();

          const routeIndex = req.url.indexOf(matched.virtualRoute);
          const relativePath = req.url
            .slice(routeIndex + matched.virtualRoute.length)
            .split("?")[0];

          if (
            serveStaticFile(
              res,
              path.join(matched.srcDir, relativePath),
              matched.contentType,
            )
          ) {
            return; // Request handled cleanly by utility
          }

          next();
        });
      },

      // 2. Production Build Output (Declarative Stream)
      closeBundle() {
        PROLOG_ASSET_MANIFEST.filter((asset) =>
          fs.existsSync(asset.srcDir),
        ).forEach((asset) =>
          asset.files.forEach((file) =>
            copySingleAsset(asset.srcDir, asset.distDir, file),
          ),
        );
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  base: "/class-scheduler/",
});
