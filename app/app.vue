<script setup lang="ts">
useSeoMeta({
  description: "Kompak98",
});

useHead({
  htmlAttrs: {
    lang: "id",
  },
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
