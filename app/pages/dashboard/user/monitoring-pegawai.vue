<script setup lang="ts">
import MonitoringPegawaiContainer from "~/features/monitoring-pegawai/MonitoringPegawaiContainer.vue";

useHead({
  title: "Dashboard - Monitoring Pegawai",
});

definePageMeta({
  layout: {
    name: "dashboard",
    props: {
      title: "Monitoring Pegawai",
    },
  },
});
</script>

<template>
  <MonitoringPegawaiContainer />
</template>
