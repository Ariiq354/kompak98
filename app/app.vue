<script setup lang="ts">
useSeoMeta({
  description: "Kompak98",
});

useHead({
  htmlAttrs: {
    lang: "id",
  },
  link: [
    {
      rel: "icon",
      href: "/favicon.ico",
      sizes: "any",
    },
    {
      rel: "apple-touch-icon",
      href: "/images/logo-vertical.webp",
    },
  ],
});
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator :height="5" />
    <UApp :toaster="{ position: 'top-right' }">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UApp>
  </div>
</template>
