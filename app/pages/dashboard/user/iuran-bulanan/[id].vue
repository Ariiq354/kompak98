<script setup lang="ts">
import HistoryIuranBulananContainer from "~/features/iuran-bulanan/user/HistoryIuranBulananContainer.vue";

useHead({
  title: "Dashboard - History Iuran Kas Bulanan",
});

definePageMeta({
  layout: {
    name: "dashboard",
    props: {
      title: "Iuran Kas Bulanan / History",
    },
  },
});

const route = useRoute();
</script>

<template>
  <HistoryIuranBulananContainer :id="Number(route.params.id)" />
</template>
