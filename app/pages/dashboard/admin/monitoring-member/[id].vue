<script setup lang="ts">
import MonitoringMemberDetailContainer from "~/features/monitoring-member/MonitoringMemberDetailContainer.vue";

useHead({
  title: "Dashboard - Detail Member",
});

definePageMeta({
  layout: {
    name: "dashboard",
    props: {
      title: "Detail Member",
    },
  },
});

const route = useRoute();
</script>

<template>
  <MonitoringMemberDetailContainer :id="Number(route.params.id)" />
</template>
