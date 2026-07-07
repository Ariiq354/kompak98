<script setup lang="ts">
import GaleriContainer from "~/features/galeri/GaleriContainer.vue";

useHead({
  title: "Dashboard - Berbagi Pengetahuan",
});

definePageMeta({
  layout: {
    name: "dashboard",
    props: {
      title: "Berbagi Pengetahuan",
    },
  },
});
</script>

<template>
  <GaleriContainer />
</template>
