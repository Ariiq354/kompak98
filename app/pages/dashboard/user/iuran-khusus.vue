<script setup lang="ts">
import IuranKhususContainer from "~/features/iuran-bulanan/user/IuranKhususContainer.vue";

useHead({
  title: "Dashboard - Iuran Khusus",
});

definePageMeta({
  layout: {
    name: "dashboard",
    props: {
      title: "Iuran Khusus",
    },
  },
});
</script>

<template>
  <IuranKhususContainer />
</template>
