<script lang="ts" setup>
import { useToastError, useToastSuccess } from "~/composables/toast";

const props = defineProps<{
  id: number;
  refresh: () => void;
}>();

const emit = defineEmits<{ close: [] }>();

const loading = ref(false);

async function onClick() {
  loading.value = true;
  try {
    await $fetch(`/api/v1/iuran/bulanan/monitoring/${props.id}/verifikasi`, { method: "PATCH" });

    props.refresh();
    emit("close");

    useToastSuccess("Sukses", "Pembayaran iuran member terkonfirmasi");
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
    :close="{ onClick: () => emit('close') }"
    title="Verifikasi Pembayaran"
    class="max-w-md"
  >
    <template #body>
      <div class="flex flex-col items-center gap-4 text-center">
        <div class="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50">
          <UIcon name="i-lucide-check-circle" class="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>

        <div class="space-y-1">
          <p class="text-lg font-semibold text-gray-900 dark:text-white">
            Verifikasi Pembayaran?
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Pastikan nominal transfer sudah sesuai dan masuk ke rekening kas sebelum melakukan konfirmasi.
          </p>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex w-full justify-end gap-3">
        <UButton
          icon="i-lucide-x"
          variant="ghost"
          color="neutral"
          :disabled="loading"
          @click="emit('close')"
        >
          Batal
        </UButton>
        <UButton
          key="confirm-payment"
          icon="i-lucide-check"
          color="primary"
          :loading="loading"
          @click="onClick"
        >
          Ya, Verifikasi
        </UButton>
      </div>
    </template>
  </LazyUModal>
</template>
