<script setup lang="ts">
import MonitoringHistoryPembayaranIuranKhususContainer from "~/features/iuran-bulanan/monitoring/MonitoringHistoryPembayaranIuranKhususContainer.vue";

useHead({
  title: "Dashboard - Monitoring History Pembayaran Iuran Khusus",
});

definePageMeta({
  layout: {
    name: "dashboard",
    props: {
      title: "Monitoring History Pembayaran Iuran Khusus",
    },
  },
});
</script>

<template>
  <MonitoringHistoryPembayaranIuranKhususContainer />
</template>
