// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [// "nuxt-security",
  "@nuxt/image", "@nuxt/ui", "@nuxt/eslint", "@vueuse/nuxt", "nuxt-charts"],

  css: ["~/assets/css/main.css"],

  ui: {
    colorMode: false,
  },

  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
  ],

  runtimeConfig: {
    public: {
      imageUrl: "https://pub-ff64f896e7f947fbb8d492e462d142e3.r2.dev",
    },
  },

  eslint: {
    config: {
      standalone: false,
    },
  },
});