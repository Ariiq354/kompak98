<script setup lang="ts">
import GaleriContainer from "~/features/galeri/GaleriContainer.vue";

useHead({
  title: "Dashboard - Foto & Info",
});

definePageMeta({
  layout: {
    name: "dashboard",
    props: {
      title: "Foto & Info",
    },
  },
});
</script>

<template>
  <GaleriContainer />
</template>
