<script setup lang="ts">
import HistoryPembayaranIuranKhususContainer from "~/features/iuran-bulanan/user/HistoryPembayaranIuranKhususContainer.vue";

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
</script>

<template>
  <HistoryPembayaranIuranKhususContainer />
</template>
