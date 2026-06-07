<script setup lang="ts">
import type { ExtractFetchData, PageSearch } from "~/utils/types";
import InputSearch from "~/components/Custom/InputSearch.vue";
import { openConfirmModal } from "~/composables/modal";
import { ObjectAssign } from "~/utils";
import CreateModal from "./components/CreateModal.vue";
import { columns, getInitialFormData } from "./constants";

const modalOpen = ref(false);

const state = shallowRef(getInitialFormData());

const query = ref<PageSearch>({ page: 1 });

const { data, status, refresh } = await useFetch("/api/v1/instansi", {
  query,
});

async function clickDelete(ids: number[]) {
  openConfirmModal("/api/v1/instansi", { ids }, refresh);
}

function clickAdd() {
  state.value = structuredClone(getInitialFormData());
  modalOpen.value = true;
}

function clickUpdate(itemData: ExtractFetchData<typeof data>[number]) {
  modalOpen.value = true;
  state.value = structuredClone(itemData);
}
</script>

<template>
  <CreateModal
    v-model:open="modalOpen"
    v-model:state="state"
    @submit="refresh"
  />
  <main class="flex flex-col container">
    <div class="mb-4 flex gap-2 md:mb-6 md:gap-4">
      <InputSearch :model-value="query.search" @update:model-value="ObjectAssign(query, { search: $event, page: 1 })" />
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
      v-model:page="query.page"
      :columns="columns"
      :data="data?.data ?? []"
      :loading="status === 'pending'"
      :total="data?.total ?? 0"
      enumerate
      deletable
      editable
      selectable
      pagination
      @edit="clickUpdate"
      @delete="clickDelete"
    />
  </main>
</template>
