import { defineConfig } from "vitest/config";
import { resolve } from "path";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react({
      // Treat .js files as containing JSX
      include: ["**/*.jsx", "**/*.js", "**/*.ts", "**/*.tsx"],
    }),
  ],
  test: {
    environment: "jsdom",
    sequence: {
      concurrency: 1, // forces sequential execution
    },
    setupFiles: ["./tests/setup.js"],
    globals: true,
    fileParallelism: false, // run test files sequentially
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./"),
    },
  },
});
