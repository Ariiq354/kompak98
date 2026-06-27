<script setup lang="ts">
import ProfileContainer from "~/features/profile/ProfileContainer.vue";

useHead({
  title: "Dashboard - Profil Saya",
});

definePageMeta({
  layout: {
    name: "dashboard",
    props: {
      title: "Profil Saya",
    },
  },
});
</script>

<template>
  <ProfileContainer />
</template>
