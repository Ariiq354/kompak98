<script setup lang="ts">
import ModalBayarHistory from "./components/ModalBayarHistory.vue";
import { historyIuranKhususColumn } from "./constants";

const props = defineProps<{
  id: number;
}>();

const { data: history, refresh } = await useFetch(`/api/v1/iuran/khusus/monitoring/${props.id}`);

function clickPayment(id: number) {
  openModal(ModalBayarHistory, { id, refresh });
}
</script>

<template>
  <UCard>
    <UButton
      class="mb-4 cursor-pointer"
      to="/dashboard/admin/monitoring-iuran-khusus"
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
            v-if="row.original.status === 'menunggu_verifikasi'"
            class="cursor-pointer"
            size="sm"
            @click="clickPayment(Number(row.original.id))"
          >
            Verifikasi
          </UButton>
          <div v-else>
            -
          </div>
        </div>
      </template>
    </DataTable>
  </UCard>
</template>
