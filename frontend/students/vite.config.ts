import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import type {ViteUserConfig } from "vitest/config";

// Extiende la configuración con Vitest
const config: ViteUserConfig = {
  plugins: [
    react(),
  ],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
  },
  server: {
    port: 5000,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  preview: {
    port: 5000,
  },
  define: {
    'import.meta.env.REACT_APP_API_HOST': JSON.stringify(process.env.REACT_APP_API_HOST|| 'localhost'),
  },
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        entryFileNames: "[name].js",
      },
    },
  },
};

export default defineConfig(config);