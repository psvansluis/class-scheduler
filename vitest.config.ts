import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/{prolog,unit}/**/*.{spec,test}.ts"],
  },
});
