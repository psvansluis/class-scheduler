import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  // Replace 'class-scheduler' with your actual GitHub repository name
  base: "/class-scheduler/",
});
