<script setup lang="ts">
import LandingNavbar from "@/components/App/LandingNavbar.vue";
import LandingFooter from "~/components/App/LandingFooter.vue";
</script>

<template>
  <main>
    <LandingNavbar />
    <slot />
    <LandingFooter />
  </main>
</template>
