<script setup lang="ts">
import MonitoringIuranBulananContainer from "~/features/iuran-bulanan/monitoring/MonitoringIuranBulananContainer.vue";

useHead({
  title: "Dashboard - Monitoring Kas Bulanan",
});

definePageMeta({
  layout: {
    name: "dashboard",
    props: {
      title: "Monitoring Kas Bulanan",
    },
  },
});
</script>

<template>
  <MonitoringIuranBulananContainer />
</template>
