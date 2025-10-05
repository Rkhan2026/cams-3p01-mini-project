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
    setupFiles: ["./tests/setup.js"],
    globals: true,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./"),
    },
  },
});
