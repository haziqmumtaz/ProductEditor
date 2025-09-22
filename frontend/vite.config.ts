// vite.config.js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import viteSvgIcons from "vite-svg-loader";

export default defineConfig({
  plugins: [vue(), tailwindcss(), viteSvgIcons()],
  preview: {
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "0.0.0.0",
      "codaproducteditorfrontend-production.up.railway.app",
    ],
  },
});
