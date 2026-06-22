<script setup lang="ts">
import ProfileContainer from "~/features/user/profile/ProfileContainer.vue";

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
