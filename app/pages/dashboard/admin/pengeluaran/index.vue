<script setup lang="ts">
import PengeluaranContainer from "~/features/pengeluaran/PengeluaranContainer.vue";

useHead({
  title: "Dashboard - Pengeluaran",
});

definePageMeta({
  layout: {
    name: "dashboard",
    props: {
      title: "Pengeluaran",
    },
  },
});
</script>

<template>
  <PengeluaranContainer />
</template>
