<script setup lang="ts">
import TagihanBelumDibayarContainer from "~/features/belum-bayar/TagihanBelumDibayarContainer.vue";

useHead({
  title: "Dashboard - Belum Bayar",
});

definePageMeta({
  layout: "dashboard",
});
</script>

<template>
  <TagihanBelumDibayarContainer />
</template>
