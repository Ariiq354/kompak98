<script setup lang="ts">
import RegisterContainer from "~/features/auth/RegisterContainer.vue";

useHead({
  title: "Kompak98 - Register",
});
definePageMeta({
  layout: "auth",
});
</script>

<template>
  <RegisterContainer />
</template>
