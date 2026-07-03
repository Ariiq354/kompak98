<script setup lang="ts">
import LandingNavbar from "@/components/App/LandingNavbar.vue";
import LandingFooter from "~/components/App/LandingFooter.vue";
</script>

<template>
  <div class="min-h-screen flex flex-col bg-default text-default font-body">
    <LandingNavbar />
    <div class="grow">
      <slot />
    </div>
    <LandingFooter />
  </div>
</template>
