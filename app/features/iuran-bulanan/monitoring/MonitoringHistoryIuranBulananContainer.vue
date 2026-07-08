<script setup lang="ts">
import { openModal } from "~/composables/modal";
import ModalBayarHistory from "./components/ModalBayarHistory.vue";
import { historyIuranBulananColumn } from "./constants";

const props = defineProps<{
  userId: number;
  iuranId: number;
}>();

const { data: historyPembayaran, refresh } = await useFetch(`/api/v1/iuran/bulanan/monitoring/${props.iuranId}`, {
  query: {
    userId: props.userId,
  },
});

function clickPayment(id: number) {
  openModal(ModalBayarHistory, { id, refresh });
}
</script>

<template>
  <UCard>
    <UButton
      class="mb-4 cursor-pointer"
      to="/dashboard/admin/monitoring-iuran-bulanan"
      leading-icon="i-lucide-step-back"
      variant="soft"
    >
      Kembali
    </UButton>

    <DataTable
      :data="historyPembayaran"
      :columns="historyIuranBulananColumn"
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
