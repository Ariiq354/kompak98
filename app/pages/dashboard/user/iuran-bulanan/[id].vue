<script setup lang="ts">
import HistoryIuranBulananContainer from "~/features/iuran-bulanan/user/HistoryIuranBulananContainer.vue";

useHead({
  title: "Dashboard - History Iuran Bulanan",
});

definePageMeta({
  layout: {
    name: "dashboard",
    props: {
      title: "History Iuran Bulanan",
    },
  },
});

const route = useRoute();
</script>

<template>
  <HistoryIuranBulananContainer :id="Number(route.params.id)" />
</template>
