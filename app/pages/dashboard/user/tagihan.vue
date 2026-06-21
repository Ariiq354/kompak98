<script setup lang="ts">
import TagihanSayaContainer from "~/features/tagihan/TagihanSayaContainer.vue";

useHead({
  title: "Dashboard - Tagihan Saya",
});

definePageMeta({
  layout: {
    name: "dashboard",
    props: {
      title: "Tagihan Saya",
    },
  },
});
</script>

<template>
  <TagihanSayaContainer />
</template>
