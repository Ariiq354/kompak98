<script setup lang="ts">
import MonitoringHistoryIuranBulananContainer from "~/features/iuran-bulanan/monitoring/MonitoringHistoryIuranBulananContainer.vue";

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

const route = useRoute();
</script>

<template>
  <MonitoringHistoryIuranBulananContainer :iuran-id="Number(route.params.id)" :user-id="Number(route.query.userId)" />
</template>
