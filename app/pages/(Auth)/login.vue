<script setup lang="ts">
import LoginContainer from "~/features/auth/LoginContainer.vue";

useHead({
  title: "Kompak98 - Login",
});
definePageMeta({
  layout: "auth",
});
</script>

<template>
  <LoginContainer />
</template>
