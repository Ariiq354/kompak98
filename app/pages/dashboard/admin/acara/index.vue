<script setup lang="ts">
import AcaraContainer from "~/features/acara/AcaraContainer.vue";

useHead({
  title: "Dashboard - Acara",
});

definePageMeta({
  layout: {
    name: "dashboard",
    props: {
      title: "Acara",
    },
  },
});
</script>

<template>
  <AcaraContainer />
</template>
