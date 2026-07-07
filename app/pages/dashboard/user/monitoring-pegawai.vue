<script setup lang="ts">
import MonitoringPegawaiContainer from "~/features/monitoring-pegawai/MonitoringPegawaiContainer.vue";

useHead({
  title: "Dashboard - Cari Teman",
});

definePageMeta({
  layout: {
    name: "dashboard",
    props: {
      title: "Cari Teman",
    },
  },
});
</script>

<template>
  <MonitoringPegawaiContainer />
</template>
