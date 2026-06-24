<script setup lang="ts">
import ModalBayarIuranKhusus from "./components/ModalBayarIuranKhusus.vue";
import { historyIuranKhususColumn } from "./constants";

const props = defineProps<{
  id: number;
}>();

const { data: history, refresh } = await useFetch(`/api/v1/iuran/khusus/me/${props.id}`);

function clickPayment(id: number, nominal: number) {
  openModal(ModalBayarIuranKhusus, {
    pembayaran: {
      id,
      nominal,
    },
    refresh,
  });
}
</script>

<template>
  <UCard>
    <UButton
      class="mb-4 cursor-pointer"
      to="/dashboard/user/iuran-khusus"
      leading-icon="i-lucide-step-back"
      variant="soft"
    >
      Kembali
    </UButton>

    <DataTable
      :data="history"
      :columns="historyIuranKhususColumn"
      enumerate
    >
      <template #aksi-cell="{ row }">
        <div class="text-center w-full">
          <UButton
            v-if="row.original.status === 'pending'"
            class="cursor-pointer"
            size="sm"
            @click="
              clickPayment(
                Number(row.original.id),
                row.original.nominal,
              )
            "
          >
            Bayar
          </UButton>
          <div v-else>
            -
          </div>
        </div>
      </template>
    </DataTable>
  </UCard>
</template>
