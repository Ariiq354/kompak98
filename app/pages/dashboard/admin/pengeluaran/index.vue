<script setup lang="ts">
import PengeluaranContainer from "~/features/pengeluaran/PengeluaranContainer.vue";

useHead({
  title: "Dashboard - Transaksi",
});

definePageMeta({
  layout: {
    name: "dashboard",
    props: {
      title: "Transaksi",
    },
  },
});
</script>

<template>
  <PengeluaranContainer />
</template>
