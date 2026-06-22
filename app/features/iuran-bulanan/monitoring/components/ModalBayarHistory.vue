<script lang="ts" setup>
import { useToastError } from "~/composables/toast";

const props = defineProps<{
  id: number;
  bulanan: boolean;
}>();

const emit = defineEmits(["close"]);

const loading = ref(false);

async function onClick() {
  loading.value = true;
  try {
    const url = props.bulanan ? `/api/v1/iuran/bulanan/${props.id}/verifikasi` : `/api/v1/iuran/khusus/${props.id}/verifikasi`;
    const navigate = props.bulanan ? "/dashboard/admin/monitoring-iuran-bulanan" : "/dashboard/admin/monitoring-iuran-khusus";

    await $fetch(url, { method: "PATCH" });

    emit("close", false);
    useToastSuccess("Sukses", "Pembayaran iuran member terkonfirmasi");
    await navigateTo(navigate);
  }
  catch (error: any) {
    useToastError("Gagal Konfirmasi Pembayaran", error.data.message);
  }
  finally {
    loading.value = false;
  }
}
</script>

<template>
  <LazyUModal
    :close="{ onClick: () => emit('close', false) }"
    title="Konfirmasi Pembayaran User"
    class="max-w-lg"
  >
    <template #body>
      <div class="space-y-5">
        <div class="flex flex-col items-center gap-4">
          <UIcon name="i-lucide-triangle-alert" size="72" class="text-green-500" />
          Apakah Anda yakin ingin verifikasi pembayaran?
        </div>
      </div>
    </template>

    <template #footer>
      <UButton
        icon="i-lucide-x"
        variant="ghost"
        :disabled="loading"
        @click="emit('close', false)"
      >
        Batal
      </UButton>
      <UButton
        key="confirm-payment"
        icon="i-lucide-check"
        :loading="loading"
        @click="onClick"
      >
        Ya
      </UButton>
    </template>
  </LazyUModal>
</template>
