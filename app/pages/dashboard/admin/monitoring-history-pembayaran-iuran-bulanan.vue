<script setup lang="ts">
import MonitoringHistoryPembayaranIuranBulananContainer from "~/features/iuran-bulanan/monitoring/MonitoringHistoryPembayaranIuranBulananContainer.vue";

useHead({
  title: "Dashboard - Monitoring History Pembayaran Iuran Bulanan",
});

definePageMeta({
  layout: {
    name: "dashboard",
    props: {
      title: "Monitoring History Pembayaran Iuran Bulanan",
    },
  },
});
</script>

<template>
  <MonitoringHistoryPembayaranIuranBulananContainer />
</template>
