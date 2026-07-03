<script setup lang="ts">
import GaleriContainer from "~/features/galeri/GaleriContainer.vue";

useHead({
  title: "Dashboard - Galeri",
});

definePageMeta({
  layout: {
    name: "dashboard",
    props: {
      title: "Galeri",
    },
  },
});
</script>

<template>
  <GaleriContainer />
</template>
