<script setup lang="ts">
import { columns, DUMMY_DATA } from "./constant";

const query = ref<PageSearch>({ page: 1 });

function clickAdd() {

}
</script>

<template>
  <UCard>
    <div class="mb-4 flex gap-2 md:mb-6 md:gap-4">
      <InputSearch
        :model-value="query.search"
        @update:model-value="Object.assign(query, { search: $event, page: 1 })"
      />
      <UButton
        icon="i-lucide-plus"
        class="text-white dark:bg-blue-600 hover:dark:bg-blue-600/75"
        @click="clickAdd"
      >
        <p class="hidden md:block">
          Tambah
        </p>
      </UButton>
    </div>

    <DataTable
      :data="DUMMY_DATA"
      :columns="columns"
      enumerate
    />
  </UCard>
</template>
