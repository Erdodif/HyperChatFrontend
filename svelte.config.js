import preprocess from "svelte-preprocess";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit:{
    alias:{
      $components: "src/lib/components",
      $icons: "src/lib/assets/icons",
      $classes: "src/lib/classes",
      $stores: "src/lib/stores",
    },
  },

  vitePlugin: {
    // This enables compile-time warnings to be
    // visible in the learn.svelte.dev editor
    onwarn: (warning, defaultHandler) => {
      console.log("svelte:warnings:%s", JSON.stringify(warning));
      defaultHandler(warning);
    },
  },

  preprocess: [
    preprocess({
      scss: {
        prependData: '@use "src/variables.scss" as *;',
      },
    }),
  ],
};

export default config;
