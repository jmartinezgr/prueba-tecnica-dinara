import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "students",
      filename: "remoteEntry.js", // Se asegura que el archivo se genere en la raíz
      exposes: {
        "./StudentsApp": "./src/StudentsApp.tsx",
      },
      shared: ["react", "react-dom"],
    }),
  ],
  server: {
    port: 5002,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  preview: {
    port: 5002,
  },
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        entryFileNames: "[name].js", // Evita que remoteEntry.js se mueva a assets
      },
    },
  },
});
