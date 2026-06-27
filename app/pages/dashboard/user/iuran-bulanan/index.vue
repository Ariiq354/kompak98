<script setup lang="ts">
import IuranBulananContainer from "~/features/iuran-bulanan/user/IuranBulananContainer.vue";

useHead({
  title: "Dashboard - Iuran Kas Bulanan",
});

definePageMeta({
  layout: {
    name: "dashboard",
    props: {
      title: "Iuran Kas Bulanan",
    },
  },
});
</script>

<template>
  <IuranBulananContainer />
</template>
