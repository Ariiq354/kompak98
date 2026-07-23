<script setup lang="ts">
import type { QueryParams } from "./constants";
import { parseDate } from "@internationalized/date";
import { ref } from "vue";
import DataTable from "~/components/Custom/DataTable.vue";
import InputSearch from "~/components/Custom/InputSearch.vue";
import ModalConfirm from "~/components/Modal/ModalConfirm.vue";
import { openModal } from "~/composables/modal";
import CreateSurveiModal from "./components/CreateSurveiModal.vue";
import HasilSurveiModal from "./components/HasilSurveiModal.vue";
import { columns, initFormData } from "./constants";

const query = ref<QueryParams>({
  page: 1,
  search: "",
});

const { data, status, refresh } = await useFetch("/api/v1/survei", {
  query,
});

const isCreateModalOpen = ref(false);
const isHasilModalOpen = ref(false);

const selectedSurveiId = ref<number | null>(null);
const selectedSurveiTitle = ref("");

const formState = ref<any>({ ...initFormData });

function clickAdd() {
  formState.value = { ...initFormData };
  isCreateModalOpen.value = true;
}

function clickEdit(item: any) {
  formState.value = {
    id: item.id,
    judul: item.judul,
    deskripsi: item.deskripsi || "",
    headerGambar: item.headerGambar || "",
    status: item.status || "draft",
    tanggalMulai: item.tanggalMulai ? (parseDate(item.tanggalMulai.split("T")[0]) as any) : undefined,
    tanggalSelesai: item.tanggalSelesai ? (parseDate(item.tanggalSelesai.split("T")[0]) as any) : undefined,
    pertanyaan: [], // Questions cannot be modified
  };
  isCreateModalOpen.value = true;
}

function clickDelete(ids: number[]) {
  openModal(ModalConfirm, {
    path: "/api/v1/survei",
    body: { ids },
    refresh,
  });
}

function viewHasil(item: any) {
  selectedSurveiId.value = item.id;
  selectedSurveiTitle.value = item.judul;
  isHasilModalOpen.value = true;
}

function dropdownItems(row: any) {
  return [
    {
      label: "Lihat Hasil Respon",
      icon: "i-lucide-bar-chart-3",
      onSelect: () => viewHasil(row),
    },
  ];
}
</script>

<template>
  <div>
    <!-- Modals -->
    <CreateSurveiModal
      v-model:open="isCreateModalOpen"
      v-model:state="formState"
      @submit="refresh"
    />

    <HasilSurveiModal
      v-if="selectedSurveiId"
      v-model:open="isHasilModalOpen"
      :survei-id="selectedSurveiId"
      :survei-title="selectedSurveiTitle"
    />

    <!-- Main Card -->
    <UCard>
      <div class="mb-4 flex gap-2 md:mb-6 md:gap-4">
        <InputSearch
          :model-value="query.search"
          placeholder="Cari judul survei..."
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

      <!-- Data Table -->
      <DataTable
        v-model:page="query.page"
        :data="data?.data ?? []"
        :columns="columns"
        :total="data?.total ?? 0"
        :loading="status === 'pending'"
        enumerate
        pagination
        deletable
        editable
        :dropdown-items="dropdownItems"
        @delete="clickDelete"
        @edit="clickEdit"
      />
    </UCard>
  </div>
</template>
