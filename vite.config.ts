import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import fs from "fs";
import path from "path";

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
    files: ["rules.pl"],
    contentType: "text/plain",
  },
];

const serveStaticFile = (
  res: any,
  filePath: string,
  contentType: string,
): boolean => {
  if (fs.existsSync(filePath)) {
    res.setHeader("Content-Type", contentType);
    res.end(fs.readFileSync(filePath));
    return true;
  }
  return false;
};

const copySingleAsset = (srcDir: string, destDir: string, file: string) => {
  fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
};

export default defineConfig({
  plugins: [
    vue(),
    {
      name: "serve-and-build-prolog",

      // 1. Local Development (Declarative Lookup)
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (!req.url) return next();

          const fileName = req.url.split("/").pop()?.split("?")[0] || "";

          const matched = PROLOG_ASSET_MANIFEST.find(
            (asset) =>
              req.url!.includes(asset.virtualRoute) &&
              asset.files.includes(fileName),
          );

          if (
            matched &&
            serveStaticFile(
              res,
              path.join(matched.srcDir, fileName),
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
  base: "/class-scheduler/",
});
