<script setup lang="ts">
import LacakLaporanContainer from "~/features/lacak-laporan/LacakLaporanContainer.vue";

useHead({
  title: "Gema - Lacak Laporan",
});

definePageMeta({
  layout: "landing",
});
</script>

<template>
  <LacakLaporanContainer />
</template>
