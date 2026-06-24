<script setup lang="ts">
import HistoryIuranKhususContainer from "~/features/iuran-khusus/user/HistoryIuranKhususContainer.vue";

useHead({
  title: "Dashboard - History Pembayaran Iuran Khusus",
});

definePageMeta({
  layout: {
    name: "dashboard",
    props: {
      title: "History Pembayaran Iuran Khusus",
    },
  },
});

const route = useRoute();
</script>

<template>
  <HistoryIuranKhususContainer />
</template>
