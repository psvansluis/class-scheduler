import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import fs from "fs";
import path from "path";

export default defineConfig({
  plugins: [
    vue(),
    {
      name: "serve-tau-prolog-locally",
      // 1. This handles "npm run dev" (Local Development)
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url && req.url.includes("/vendor/tau-prolog/")) {
            const fileName = req.url.split("/").pop()?.split("?")[0];
            const filePath = path.resolve(
              __dirname,
              `node_modules/tau-prolog/modules/${fileName}`,
            );

            if (fs.existsSync(filePath)) {
              res.setHeader("Content-Type", "application/javascript");
              res.end(fs.readFileSync(filePath));
              return;
            }
          }
          next();
        });
      },
      // 2. This handles "npm run build" (Production Deployment for GitHub Actions)
      closeBundle() {
        const srcDir = path.resolve(
          __dirname,
          "node_modules/tau-prolog/modules",
        );
        const destDir = path.resolve(__dirname, "dist/vendor/tau-prolog");

        if (fs.existsSync(srcDir)) {
          fs.mkdirSync(destDir, { recursive: true });
          const files = ["core.js", "lists.js"]; // Add any other modules you need here
          files.forEach((file) => {
            fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
          });
        }
      },
    },
  ],
  base: "/class-scheduler/",
});
