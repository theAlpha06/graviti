import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // Optionally configure the server
    hmr: {
      // Enable HTTP/2 for hmr server
      protocol: "http",
    },
    // Enable serving files from the .vite directory
    fs: {
      strict: false,
    },
  },

  build: {
    outDir: 'build'
  }
});
