// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  modules: [
    // "nuxt-security",
    "@nuxt/image",
    "@nuxt/ui",
    "@nuxt/eslint",
    "@vueuse/nuxt",
    "nuxt-charts",
  ],

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

  // security: {
  //   sri: false,
  //   headers: {
  //     crossOriginResourcePolicy: "same-site",
  //     contentSecurityPolicy: {
  //       "img-src": [
  //         "'self'",
  //         "data:",
  //         "blob:",
  //         "https://assets.kompak98.com",
  //       ],
  //     },
  //   },
  // },

  runtimeConfig: {
    public: {
      imageUrl: "https://assets.kompak98.com",
    },
  },

  eslint: {
    config: {
      standalone: false,
    },
  },
});
