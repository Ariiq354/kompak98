<script setup lang="ts">
import MonitoringMemberContainer from "~/features/iuran-bulanan/monitoring/MonitoringMemberContainer.vue";

useHead({
  title: "Dashboard - Monitoring Member",
});

definePageMeta({
  layout: {
    name: "dashboard",
    props: {
      title: "Monitoring Member",
    },
  },
});
</script>

<template>
  <MonitoringMemberContainer />
</template>
