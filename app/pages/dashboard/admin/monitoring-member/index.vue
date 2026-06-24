<script setup lang="ts">
import MonitoringMemberContainer from "~/features/monitoring-member/MonitoringMemberContainer.vue";

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
