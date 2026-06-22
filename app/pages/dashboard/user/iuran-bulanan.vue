<script setup lang="ts">
import IuranBulananContainer from "~/features/iuran-bulanan/user/IuranBulananContainer.vue";

useHead({
  title: "Dashboard - Iuran Bulanan",
});

definePageMeta({
  layout: {
    name: "dashboard",
    props: {
      title: "Iuran Bulanan",
    },
  },
});
</script>

<template>
  <IuranBulananContainer />
</template>
