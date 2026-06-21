<script setup lang="ts">
import TagihanAdminContainer from "~/features/tagihan/TagihanAdminContainer.vue";

useHead({
  title: "Dashboard - Tagihan",
});

definePageMeta({
  layout: {
    name: "dashboard",
    props: {
      title: "Daftar Tagihan",
    },
  },
});
</script>

<template>
  <TagihanAdminContainer />
</template>
