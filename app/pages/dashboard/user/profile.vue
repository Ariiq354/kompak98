<script setup lang="ts">
import ProfileContainer from "~/features/iuran-bulanan/user/ProfileContainer.vue";

useHead({
  title: "Dashboard - Profile",
});

definePageMeta({
  layout: {
    name: "dashboard",
    props: {
      title: "Profile",
    },
  },
});
</script>

<template>
  <ProfileContainer />
</template>
