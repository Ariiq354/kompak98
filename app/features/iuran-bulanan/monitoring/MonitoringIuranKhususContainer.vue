<script setup lang="ts">
import type { HistoryState } from "vue-router";
import { UButton } from "#components";
import DataTable from "~/components/Custom/DataTable.vue";
import ModalConfirm from "~/components/Modal/ModalConfirm.vue";
import { formatDate } from "~/utils/index";
import {
  getInitialFormDataTagihanKhusus,
  getStatusConfig,
  getStatusLabel,

  iuranKhususColumns,
} from "../constants";
import ModalCreateTagihanKhusus from "./components/ModalCreateTagihanKhusus.vue";

const query = ref<PageSearch>({
  page: 1,
  search: "",
});

const { data, status, refresh } = await useFetch("/api/v1/iuran/khusus", {
  query,
});

function clickHistory(row: any) {
  navigateTo({
    path: "/dashboard/admin/monitoring-history-pembayaran-iuran-khusus",
    state: {
      historyPembayaran: JSON.stringify(row.historyPembayaran),
    } as HistoryState,
  });
}

function getStatusBulan(row: any, bulan: number) {
  return row.original.bulan?.find((item: any) => item.bulan === bulan)?.status;
}

const modalOpen = ref(false);
const state = shallowRef(getInitialFormDataTagihanKhusus());

function clickAdd() {
  state.value = structuredClone(getInitialFormDataTagihanKhusus());
  modalOpen.value = true;
}

function clickUpdate(itemData: ExtractFetchData<typeof data>[number]) {
  modalOpen.value = true;
  state.value = {
    id: itemData.id,
    judul: itemData.judul,
    deskripsi: itemData.deskripsi,
    nominalAnjuran: itemData.nominalAnjuran,
    tanggalAkhir: itemData.tanggalAkhir ?? undefined,
  };
}

async function clickDelete(ids: number[]) {
  openModal(ModalConfirm, { path: "/api/v1/iuran/khusus", body: { ids }, refresh });
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
      v-model:page="query.page"
      :data="data?.data ?? []"
      :columns="iuranKhususColumns"
      :total="data?.total ?? 0"
      :loading="status === 'pending'"
      enumerate
      pagination
      deletable
      editable
      viewable
      @view="clickHistory"
      @edit="clickUpdate"
      @delete="clickDelete"
    >
      <template
        v-for="bulan in 12"
        :key="bulan"
        #[`bulan_${bulan}-cell`]="{ row }"
      >
        <div class="flex justify-center">
          <UTooltip
            :text="getStatusLabel(getStatusBulan(row, bulan))"
            :content="{
              align: 'center',
              side: 'top',
              sideOffset: 8,
            }"
          >
            <div
              class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md"
              :class="[getStatusConfig(getStatusBulan(row, bulan)).class]"
            >
              <UIcon
                :name="getStatusConfig(getStatusBulan(row, bulan)).icon"
                class="h-4 w-4"
              />
            </div>
          </UTooltip>
        </div>
      </template>
      <template #daskripsi-cell="{ row }">
        <div class="max-w-md">
          {{ row.original.deskripsi }}
        </div>
      </template>
      <template #nominalAnjuran-cell="{ row }">
        {{
          new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
          }).format(row.original.nominalAnjuran)
        }}
      </template>
      <template #tanggalAkhir-cell="{ row }">
        {{ formatDate(row.original.tanggalAkhir) }}
      </template>
    </DataTable>
  </UCard>

  <ModalCreateTagihanKhusus
    v-model:open="modalOpen"
    v-model:state="state"
    @submit="refresh"
  />
</template>
