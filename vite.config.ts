import { defineConfig } from "vite";
import { sveltekit } from "@sveltejs/kit/vite";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    sveltekit(),
    wasm(),
    topLevelAwait()
  ],

  server: {
    fs: {
      strict: false,
    },
  },

  css: {
    preprocessorOptions: {
      scss: {
        includePaths:['src'],
      },
    },
  },
});
