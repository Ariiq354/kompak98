<script setup lang="ts">
import About from "./components/About.vue";
import Event from "./components/Event.vue";
import Hero from "./components/Hero.vue";
import UpcomingEvent from "./components/UpcomingEvent.vue";

const { data: belum } = await useFetch("/api/v1/acara/landing/belum");
const config = useRuntimeConfig();

const latestEvent = computed(() => {
  if (!belum.value || belum.value.length === 0)
    return null;
  const event = belum.value[0];
  return {
    date: event?.tanggal,
    title: event?.judul,
    location: event?.tempat,
    image: event?.foto,
  };
});

const isModalOpen = ref(false);

onMounted(() => {
  if (latestEvent.value) {
    isModalOpen.value = true;
  }
});

function scrollToUpcoming() {
  isModalOpen.value = false;
  const element = document.getElementById("akan-datang");
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
}
</script>

<template>
  <div class="overflow-x-hidden">
    <Hero />
    <Event />
    <UpcomingEvent :events="belum" />
    <About />

    <!-- Popup Info Agenda Terdekat -->
    <UModal
      v-model:open="isModalOpen"
      title="Agenda Terdekat"
    >
      <template #body>
        <div v-if="latestEvent" class="space-y-4">
          <!-- Image Banner -->
          <div class="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/60 shadow-sm">
            <NuxtImg
              v-if="latestEvent.image"
              :src="`${config.public.imageUrl}/${latestEvent.image}`"
              class="w-full h-full object-cover object-center"
              alt="Latest Event Image"
            />
            <div class="absolute top-4 left-4">
              <span class="inline-flex py-1 px-3 bg-white/95 backdrop-blur-md text-xs font-bold text-navy-900 rounded-full border border-slate-200/50 shadow-sm">
                {{ latestEvent.date }}
              </span>
            </div>
          </div>

          <!-- Event Details -->
          <div class="space-y-3">
            <h3 class="text-xl font-extrabold text-slate-900 leading-tight">
              {{ latestEvent.title }}
            </h3>

            <div class="flex items-center gap-2 text-slate-500 text-sm">
              <UIcon name="i-lucide-map-pin" class="w-4 h-4 text-slate-400 shrink-0" />
              <span class="font-medium">{{ latestEvent.location }}</span>
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-2 w-full">
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-lucide-x"
            @click="() => { isModalOpen = false }"
          >
            Tutup
          </UButton>
          <UButton
            color="primary"
            icon="i-lucide-calendar"
            @click="scrollToUpcoming"
          >
            Lihat Detail
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
