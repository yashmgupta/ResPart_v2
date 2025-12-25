import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/research-swipe-react/", // IMPORTANT for GitHub Pages
});
