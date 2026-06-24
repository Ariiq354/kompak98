<script setup lang="ts">
import MonitoringHistoryIuranKhususContainer from "~/features/iuran-khusus/monitoring/MonitoringHistoryIuranKhususContainer.vue";

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

const route = useRoute();
</script>

<template>
  <MonitoringHistoryIuranKhususContainer :id="Number(route.params.id)" />
</template>
