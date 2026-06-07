<script setup lang="ts">
import LandingContainer from "~/features/landing/LandingContainer.vue";

useHead({
  title: "Gema - Home",
});

definePageMeta({
  layout: "landing",
});
</script>

<template>
  <LandingContainer />
</template>
