<script setup lang="ts">
import MonitoringIuranKhususContainer from "~/features/iuran-bulanan/monitoring/MonitoringIuranKhususContainer.vue";

useHead({
  title: "Dashboard - Monitoring Iuran Khusus",
});

definePageMeta({
  layout: {
    name: "dashboard",
    props: {
      title: "Monitoring Iuran Khusus",
    },
  },
});
</script>

<template>
  <MonitoringIuranKhususContainer />
</template>
