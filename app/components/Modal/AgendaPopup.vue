<script setup lang="ts">
const props = withDefaults(defineProps<{
  open?: boolean;
  detailTarget?: string;
}>(), {
  open: true,
  detailTarget: "#akan-datang",
});

const { data: events } = await useFetch("/api/v1/acara/landing/belum");
const config = useRuntimeConfig();
const isModalOpen = ref(false);

const latestEvent = computed(() => {
  if (!events.value || events.value.length === 0)
    return null;

  const event = events.value[0];
  return {
    date: event?.tanggal,
    title: event?.judul,
    location: event?.tempat,
    image: event?.foto,
  };
});

watch([() => props.open, latestEvent], ([open, event]) => {
  if (open && event) {
    isModalOpen.value = true;
  }
}, { immediate: true });

function closeModal() {
  isModalOpen.value = false;
}

async function showDetails() {
  closeModal();

  if (props.detailTarget.startsWith("#")) {
    document.querySelector(props.detailTarget)?.scrollIntoView({ behavior: "smooth" });
    return;
  }

  await navigateTo(props.detailTarget);
}
</script>

<template>
  <UModal v-model:open="isModalOpen" :close="false">
    <template #body>
      <div v-if="latestEvent" class="space-y-4">
        <div class="relative aspect-video w-full overflow-hidden rounded-2xl border border-slate-200/60 bg-slate-100 shadow-sm">
          <NuxtImg
            v-if="latestEvent.image"
            :src="`${config.public.imageUrl}/${latestEvent.image}`"
            class="h-full w-full object-cover object-center"
            alt="Latest Event Image"
          />
          <div class="absolute left-4 top-4">
            <span class="inline-flex rounded-full border border-slate-200/50 bg-white/95 px-3 py-1 text-xs font-bold text-navy-900 shadow-sm backdrop-blur-md">
              {{ latestEvent.date }}
            </span>
          </div>
        </div>

        <div class="space-y-3">
          <h3 class="text-xl font-extrabold leading-tight text-slate-900">
            {{ latestEvent.title }}
          </h3>
          <div class="flex items-center gap-2 text-sm text-slate-500">
            <UIcon name="i-lucide-map-pin" class="h-4 w-4 shrink-0 text-slate-400" />
            <span class="font-medium">{{ latestEvent.location }}</span>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton color="neutral" variant="ghost" icon="i-lucide-x" @click="closeModal">
          Tutup
        </UButton>
        <UButton color="primary" icon="i-lucide-calendar" @click="showDetails">
          Lihat Detail
        </UButton>
      </div>
    </template>
  </UModal>
</template>
