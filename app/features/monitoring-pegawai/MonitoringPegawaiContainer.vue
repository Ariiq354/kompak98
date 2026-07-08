<script setup lang="ts">
import type { QueryParams } from "~/features/monitoring-member/constants";
import InputSearch from "~/components/Custom/InputSearch.vue";
import { KODE_JABATAN_OPTIONS } from "~/features/monitoring-member/constants";
import { ObjectAssign } from "~/utils";

const query = ref<QueryParams>({
  page: 1,
  search: "",
  limit: 12,
  kodeJabatan: undefined,
});

const { data, status } = await useFetch("/api/v1/users/pegawai", {
  query,
});

const config = useRuntimeConfig();
</script>

<template>
  <div class="space-y-6">
    <!-- Search and Filter controls -->
    <div class="flex items-center gap-4">
      <InputSearch
        :model-value="query.search"
        class="max-w-md w-full"
        @update:model-value="ObjectAssign(query, { search: $event, page: 1 })"
      />

      <USelectMenu
        :model-value="query.kodeJabatan"
        :items="KODE_JABATAN_OPTIONS"
        placeholder="Pilih Jabatan"
        clear
        class="w-64"
        @update:model-value="ObjectAssign(query, { kodeJabatan: $event ?? undefined, page: 1 })"
      />
    </div>

    <!-- Employee Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Loading Skeleton State -->
      <template v-if="status === 'pending'">
        <UCard v-for="i in 6" :key="i">
          <div class="flex gap-4">
            <USkeleton class="w-14 h-14 rounded-full shrink-0" />
            <div class="space-y-2 w-full mt-2">
              <USkeleton class="h-4 w-3/4" />
              <USkeleton class="h-3 w-1/2" />
            </div>
          </div>
          <div class="space-y-3 mt-6">
            <USkeleton v-for="j in 2" :key="j" class="h-4 w-full" />
          </div>
        </UCard>
      </template>

      <!-- Empty State -->
      <template v-else-if="!data?.data || data.data.length === 0">
        <div class="col-span-full py-12 flex flex-col items-center justify-center text-center">
          <UIcon name="i-lucide-users" class="w-12 h-12 text-gray-400 mb-4" />
          <p class="text-lg font-medium text-gray-900 dark:text-white">
            Tidak ada data pegawai
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Coba ganti kata kunci pencarian Anda.
          </p>
        </div>
      </template>

      <!-- Employee Cards -->
      <template v-else>
        <UCard
          v-for="item in data.data"
          :key="item.id"
          class="flex flex-col transition-all hover:shadow-lg"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex gap-4 min-w-0">
              <UAvatar
                :alt="item.name"
                class="size-14"
                :src="item.foto ? `${config.public.imageUrl}/${item.foto}` : undefined"
              />

              <p class="text-lg font-semibold my-auto text-gray-900 dark:text-white truncate">
                {{ item.name }}
              </p>
            </div>
          </div>

          <div class="flex flex-col gap-3 mt-6 text-sm text-gray-600 dark:text-gray-300">
            <div class="flex items-center gap-3">
              <UIcon name="i-lucide-building-2" class="w-4 h-4 shrink-0 text-gray-400" />
              <span class="truncate">{{ item.namaKantor || '-' }}</span>
            </div>
            <div class="flex items-center gap-3">
              <UIcon name="i-lucide-phone" class="w-4 h-4 shrink-0 text-gray-400" />
              <span class="truncate">{{ item.noHp || '-' }}</span>
            </div>
          </div>
        </UCard>
      </template>
    </div>

    <!-- Pagination -->
    <div v-if="data?.total" class="flex items-center justify-center md:justify-between border-t border-gray-100 dark:border-gray-800 pt-6">
      <p class="text-sm text-gray-500 dark:text-gray-400 hidden md:block">
        Menampilkan {{ (query.page - 1) * query.limit + 1 }} sampai
        {{ Math.min(query.page * query.limit, data?.total) }} dari {{ data?.total }} pegawai
      </p>
      <div class="flex justify-center">
        <UPagination
          v-model:page="query.page"
          :total="data?.total"
          :items-per-page="query.limit"
        />
      </div>
    </div>
  </div>
</template>
