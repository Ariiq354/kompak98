<script setup lang="ts">
import TagihanBelumDibayarContainer from "~/features/belum-bayar/TagihanBelumDibayarContainer.vue";

useHead({
  title: "Dashboard - Belum Dibayar",
});

definePageMeta({
  layout: {
    name: "dashboard",
    props: {
      title: "Pending Pembayaran",
    },
  },
});
</script>

<template>
  <TagihanBelumDibayarContainer />
</template>
