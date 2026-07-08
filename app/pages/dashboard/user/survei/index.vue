<script setup lang="ts">
import UserSurveiContainer from "~/features/survei/UserSurveiContainer.vue";

useHead({
  title: "Dashboard - Survei",
});

definePageMeta({
  layout: {
    name: "dashboard",
    props: {
      title: "Daftar Survei",
    },
  },
});
</script>

<template>
  <UserSurveiContainer />
</template>
