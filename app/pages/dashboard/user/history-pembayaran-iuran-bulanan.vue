<script setup lang="ts">
import HistoryPembayaranIuranBulananContainer from "~/features/iuran-bulanan/user/HistoryPembayaranIuranBulananContainer.vue";

useHead({
  title: "Dashboard - History Pembayaran Iuran Bulanan",
});

definePageMeta({
  layout: {
    name: "dashboard",
    props: {
      title: "History Pembayaran Iuran Bulanan",
    },
  },
});
</script>

<template>
  <HistoryPembayaranIuranBulananContainer />
</template>
