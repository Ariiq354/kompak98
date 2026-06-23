<script setup lang="ts">
import { getInitials } from "./constant";

const query = ref<PageSearch>({
  page: 1,
  search: "",
});

const { data, status, refresh } = await useFetch(
  "/api/v1/users/monitoring",
  {
    query,
  },
);

const config = useRuntimeConfig();
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <div
      v-for="item in data?.data"
      :key="item.id"
      class="rounded-lg p-5 border border-gray-200 shadow-md"
    >
      <div class="flex items-start justify-between">
        <div class="flex gap-4">
          <NuxtImg
            v-if="item.foto"
            :src="`${config.public.imageUrl}/${item.foto}`"
            class="w-14 h-14 rounded-full object-cover"
          />

          <div
            v-else
            class="w-14 h-14 rounded-full bg-primary-100 text-white flex items-center justify-center font-semibold text-lg"
          >
            {{ getInitials(item.name) }}
          </div>

          <div>
            <p class="text-xl text-primary font-semibold">
              {{ item.name }}
            </p>
            <p class="text-sm text-gray-500">
              {{ item.namaPangkat }}
            </p>
          </div>
        </div>

        <p
          v-if="item.namaPangkat"
          class="rounded-full bg-gray-200 px-3 py-1 text-black text-xs shadow-sm"
        >
          {{ item.namaJabatan }}
        </p>
      </div>

      <div class="flex flex-col gap-1 mt-4 text-sm">
        <p>{{ item.pendidikanFormal || '-' }}</p>
        <p>{{ item.namaJabatan || '-' }}</p>
        <p>{{ item.namaKantor || '-' }}</p>
        <p>{{ item.noHp || '-' }}</p>
      </div>

      <hr class="my-4 border-gray-200">
      <UButton class="w-full cursor-pointer text-center rounded-xl h-10">
        Detail
      </UButton>
    </div>
  </div>
</template>
