<script setup lang="ts">
import DashboardContainer from "~/features/dashboard/DashboardContainer.vue";

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
