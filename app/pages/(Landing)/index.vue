<script setup lang="ts">
import LandingContainer from "~/features/landing/LandingContainer.vue";
import { useLandingSeo, useWebsiteStructuredData } from "~/utils/seo";

useLandingSeo({
  title: "KOMPAK 98 | Portal Resmi Alumni",
  description: "Portal resmi alumni KOMPAK 98 untuk mempererat silaturahmi, berbagi informasi acara, dan membangun kolaborasi yang bermanfaat.",
  path: "/",
  image: "/images/image1.webp",
});

useWebsiteStructuredData();

definePageMeta({
  layout: "landing",
});
</script>

<template>
  <LandingContainer />
</template>
