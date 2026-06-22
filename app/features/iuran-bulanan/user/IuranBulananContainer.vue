<script setup lang="ts">
import { UButton } from "#components";
import DataTable from "~/components/Custom/DataTable.vue";
import ModalBayarIuranBulanan from "./components/ModalBayarIuranBulanan.vue";
import { baseColumns, getPendingMonths } from "./constants";

const query = ref<PageSearch>({ page: 1, search: "" });

const { data, status, refresh } = await useFetch("/api/v1/iuran/bulanan/me", {
  query,
});
function clickPayment(id: number, pendingPayment: number[]) {
  openModal(ModalBayarIuranBulanan, { path: "", id, pendingPayment, refresh });
}

function getStatusBulan(row: any, bulan: number) {
  return row.original.bulan?.find(
    (item: any) => item.bulan === bulan,
  )?.status;
}

function getStatusConfig(status?: string) {
  switch (status) {
    case "lunas":
      return {
        icon: "i-lucide-check",
        class: "bg-primary text-white",
      };

    case "menunggu_verifikasi":
      return {
        icon: "i-lucide-hourglass",
        class: "bg-yellow-50 text-orange-400",
      };

    default:
      return {
        icon: "i-lucide-minus",
        class: "bg-gray-100 text-gray-600",
      };
  }
}
</script>

<template>
  <UCard>
    <div class="mb-4 flex gap-2 md:mb-6 md:gap-4">
      <InputSearch
        :model-value="query.search"
        @update:model-value="Object.assign(query, { search: $event, page: 1 })"
      />
    </div>

    <DataTable
      v-model:page="query.page"
      :data="data?.data ?? []"
      :columns="baseColumns"
      :total="data?.total ?? 0"
      :loading="status === 'pending'"
      enumerate
      pagination
    >
      <template
        v-for="bulan in 12"
        :key="bulan"
        #[`bulan_${bulan}-cell`]="{ row }"
      >
        <div class="flex justify-center">
          <div
            class="flex h-8 w-8 items-center justify-center rounded-md" :class="[
              getStatusConfig(getStatusBulan(row, bulan)).class,
            ]"
          >
            <UIcon
              :name="getStatusConfig(getStatusBulan(row, bulan)).icon"
              class="h-4 w-4"
            />
          </div>
        </div>
      </template>

      <template #aksi-cell="{ row }">
        <div class="flex gap-2">
          <UButton
            class="cursor-pointer"
            size="sm"
            @click="clickPayment(
              Number(row.original.id),
              getPendingMonths(row.original.bulan),
            )"
          >
            Bayar
          </UButton>
          <UButton
            class="bg-orange-500 hover:bg-orange-400 active:bg-orange-400 cursor-pointer"
            size="sm"
            @click="clickPayment(
              Number(row.original.id),
              [1, 2],
            )"
          >
            History
          </UButton>
        </div>
      </template>
    </DataTable>
  </UCard>
</template>
