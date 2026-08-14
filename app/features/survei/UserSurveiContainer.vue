<script setup lang="ts">
import type { QueryParams } from "./constants";
import { ref } from "vue";
import InputSearch from "~/components/Custom/InputSearch.vue";
import { formatDateIndo } from "~/utils";
import JawabSurveiModal from "./components/JawabSurveiModal.vue";

const query = ref<QueryParams>({
  page: 1,
  search: "",
  limit: 10,
  status: "published",
});

const { data, status, refresh } = await useFetch("/api/v1/survei", {
  query,
});

const isJawabModalOpen = ref(false);
const selectedSurveiId = ref<number | null>(null);
const selectedSurveiTitle = ref("");
const config = useRuntimeConfig();

function clickJawab(item: any) {
  selectedSurveiId.value = item.id;
  selectedSurveiTitle.value = item.judul;
  isJawabModalOpen.value = true;
}
</script>

<template>
  <div class="space-y-6">
    <!-- Jawab Survei Modal -->
    <JawabSurveiModal
      v-if="selectedSurveiId"
      v-model:open="isJawabModalOpen"
      :survei-id="selectedSurveiId"
      :survei-title="selectedSurveiTitle"
      @submit="refresh"
    />

    <!-- Header & Search -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h3 class="font-bold text-xl text-default">
          Daftar Survei
        </h3>
        <p class="text-sm text-muted">
          Pilih dan isi survei aktif yang tersedia
        </p>
      </div>
      <div class="w-full md:w-80">
        <InputSearch
          :model-value="query.search"
          placeholder="Cari survei..."
          @update:model-value="Object.assign(query, { search: $event, page: 1 })"
        />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="status === 'pending'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <UCard v-for="n in 4" :key="n" class="animate-pulse overflow-hidden" :ui="{ body: 'p-0 sm:p-0' }">
        <div class="h-44 sm:h-48 bg-muted/30 w-full" />
        <div class="p-5 space-y-4">
          <div class="h-6 bg-muted/40 rounded w-3/4" />
          <div class="h-4 bg-muted/30 rounded w-5/6" />
          <div class="h-4 bg-muted/30 rounded w-1/2" />
        </div>
      </UCard>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="!data?.data || data.data.length === 0"
      class="flex flex-col items-center justify-center py-20 text-center bg-elevated/10 rounded-2xl border border-dashed border-muted space-y-4"
    >
      <UIcon name="i-lucide-clipboard-x" class="h-16 w-16 text-dimmed" />
      <div class="space-y-1">
        <p class="font-semibold text-lg text-default">
          Tidak Ada Survei Tersedia
        </p>
        <p class="text-sm text-muted max-w-sm">
          Saat ini belum ada survei aktif yang bisa diisi. Silakan cek kembali beberapa saat lagi.
        </p>
      </div>
    </div>

    <!-- Grid List -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <UCard
        v-for="item in data.data"
        :key="item.id"
        class="group hover:border-primary/50 transition-all duration-300 flex flex-col justify-between overflow-hidden"
        :ui="{ body: 'p-0 sm:p-0' }"
      >
        <!-- Large Banner / Header Image at Top -->
        <div class="relative w-full h-44 sm:h-48 overflow-hidden bg-muted/20 flex items-center justify-center border-b border-muted/50">
          <NuxtImg
            v-if="item.headerGambar"
            :src="item.headerGambar.startsWith('http') ? item.headerGambar : `${config.public.imageUrl}/${item.headerGambar}`"
            :alt="item.judul"
            class="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          <div
            v-else
            class="w-full h-full flex items-center justify-center p-6 bg-linear-to-br from-primary/5 via-muted/10 to-primary/10"
          >
            <NuxtImg
              src="/images/logo-horizontal.webp"
              alt="Logo Kompak 98"
              class="max-h-16 w-auto max-w-[70%] object-contain transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          <!-- Date Badge overlaid on top-right -->
          <div class="absolute top-3 right-3 backdrop-blur-md bg-background/85 dark:bg-background/85 px-2.5 py-1 rounded-full shadow-xs border border-border/50">
            <span class="text-[11px] text-default font-medium">
              {{ formatDateIndo(item.createdAt) }}
            </span>
          </div>
        </div>

        <div class="p-5 space-y-3 grow flex flex-col justify-between">
          <div class="space-y-2">
            <h4 class="font-bold text-lg text-default group-hover:text-primary transition-colors line-clamp-1">
              {{ item.judul }}
            </h4>

            <p class="text-sm text-muted line-clamp-3 min-h-15">
              {{ item.deskripsi || 'Tidak ada deskripsi untuk survei ini.' }}
            </p>
          </div>
        </div>

        <template #footer>
          <UButton
            icon="i-lucide-pencil-line"
            block
            class="text-white dark:bg-blue-600 hover:dark:bg-blue-600/75"
            @click="clickJawab(item)"
          >
            Mulai Isi Survei
          </UButton>
        </template>
      </UCard>
    </div>

    <!-- Pagination -->
    <div v-if="data?.total && data.total > (query.limit || 10)" class="flex justify-center mt-6">
      <UPagination v-model:page="query.page" :total="data.total" :sibling-count="1" />
    </div>
  </div>
</template>
