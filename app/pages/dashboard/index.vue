<script setup lang="ts">
import DashboardContainer from "~/features/dashboard/DashboardContainer.vue";

useHead({
  title: "Kompak98 - Dashboard",
});

definePageMeta({
  layout: {
    name: "dashboard",
    props: {
      title: "Dashboard",
    },
  },
});
</script>

<template>
  <DashboardContainer />
</template>
