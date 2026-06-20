<script setup lang="ts">
import TagihanAdminContainer from "~/features/tagihan/TagihanAdminContainer.vue";

useHead({
  title: "Dashboard - Tagihan",
});

definePageMeta({
  layout: "dashboard",
});
</script>

<template>
  <TagihanAdminContainer />
</template>
