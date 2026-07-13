<script setup lang="ts">
import AgendaPopup from "~/components/Modal/AgendaPopup.vue";
import About from "./components/About.vue";
import Event from "./components/Event.vue";
import Hero from "./components/Hero.vue";
import UpcomingEvent from "./components/UpcomingEvent.vue";

const { data: belum } = await useFetch("/api/v1/acara/landing/belum");
</script>

<template>
  <div class="overflow-x-hidden">
    <Hero />
    <Event />
    <UpcomingEvent :events="belum" />
    <About />

    <!-- Popup Info Agenda Terdekat -->
    <AgendaPopup />
  </div>
</template>
