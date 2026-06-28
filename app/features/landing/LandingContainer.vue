<script setup lang="ts">
import About from "./components/About.vue";
import Event from "./components/Event.vue";
import Hero from "./components/Hero.vue";
import UpcomingEvent from "./components/UpcomingEvent.vue";
</script>

<template>
  <div class="overflow-x-hidden">
    <Hero />
    <Event />
    <UpcomingEvent />
    <About />
  </div>
</template>
