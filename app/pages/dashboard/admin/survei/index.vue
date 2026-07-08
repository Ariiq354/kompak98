<script setup lang="ts">
import AdminSurveiContainer from "~/features/survei/AdminSurveiContainer.vue";

useHead({
  title: "Dashboard - Survei Admin",
});

definePageMeta({
  layout: {
    name: "dashboard",
    props: {
      title: "Survei (Admin)",
    },
  },
});
</script>

<template>
  <AdminSurveiContainer />
</template>
