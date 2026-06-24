<script setup lang="ts">
import ModalBayarIuranBulanan from "./components/ModalBayarIuranBulanan.vue";
import { historyIuranBulananColumn } from "./constants";

const props = defineProps<{
  id: number;
}>();

const { data: history } = await useFetch(`/api/v1/iuran/bulanan/me/${props.id}`);

function clickPayment(id: number, nominal: number) {
  openModal(ModalBayarIuranBulanan, {
    pembayaran: {
      id,
      nominal,
    },
  });
}
</script>

<template>
  <UCard>
    <UButton
      class="mb-4 cursor-pointer"
      to="/dashboard/user/iuran-bulanan"
      leading-icon="i-lucide-step-back"
      variant="soft"
    >
      Kembali
    </UButton>

    <DataTable
      :data="history"
      :columns="historyIuranBulananColumn"
      enumerate
    >
      <template #aksi-cell="{ row }">
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
      </template>
    </DataTable>
  </UCard>
</template>
