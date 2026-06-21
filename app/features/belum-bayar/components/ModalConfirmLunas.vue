<script lang="ts" setup>
import { useToastError } from "~/composables/toast";

const props = defineProps<{
  id: number;
  refresh: () => void;
}>();

const emit = defineEmits(["close"]);

const loading = ref(false);
async function onClick() {
  loading.value = true;
  try {
    await $fetch(`/api/v1/tagihan/admin/${props.id}/verifikasi`, {
      method: "PATCH",
      body: {
        status: "lunas",
      },
    });
    props.refresh();
    emit("close", false);
    useToastSuccess("Pembayaran Terverifikasi");
  }
  catch (error: any) {
    useToastError("Gagal Update Status Pembayaran", error.data.message);
  }
  finally {
    loading.value = false;
  }
}
</script>

<template>
  <UModal
    :close="{ onClick: () => emit('close', false) }"
    :ui="{ body: 'sm:max-w-lg' }"
    title="Konfirmasi"
  >
    <template #body>
      <div class="flex flex-col items-center gap-4 text-center">
        <div
          class="flex h-16 w-16 items-center justify-center rounded-full bg-green-50"
        >
          <UIcon
            name="i-lucide-check-circle-2"
            size="36"
            class="text-green-600"
          />
        </div>

        <div class="space-y-1">
          <p class="text-base font-semibold text-gray-900">
            Verifikasi pembayaran ini?
          </p>

          <p class="text-sm text-gray-500">
            Pastikan pembayaran sudah diterima sebelum melanjutkan.
          </p>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton
          variant="ghost"
          color="neutral"
          :disabled="loading"
          @click="emit('close', false)"
        >
          Batal
        </UButton>

        <UButton
          color="success"
          :loading="loading"
          icon="i-lucide-check"
          @click="onClick"
        >
          Ya, sudah lunas
        </UButton>
      </div>
    </template>
  </UModal>
</template>
