<script setup lang="ts">
import TagihanSayaContainer from "~/features/tagihan/TagihanSayaContainer.vue";

useHead({
  title: "Dashboard - Tagihan Saya",
});

definePageMeta({
  layout: "dashboard",
});
</script>

<template>
  <TagihanSayaContainer />
</template>
