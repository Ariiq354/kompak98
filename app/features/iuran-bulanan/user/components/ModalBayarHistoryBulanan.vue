<script lang="ts" setup>
import { useToastError } from "~/composables/toast";

const props = defineProps<{
  id: number;
  nominal: number;
}>();

const emit = defineEmits(["close"]);

const loading = ref(false);

const formattedNominal = computed(() =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(props.nominal),
);

async function onClick() {
  loading.value = true;
  try {
    await $fetch(`/api/v1/iuran/bulanan/${props.id}/bayar`, {
      method: "PATCH",
    });

    emit("close", false);
    useToastSuccess("Sukses", "Silahkan tunggu konfirmasi status pembayaran");
    await navigateTo("/dashboard/user/iuran-bulanan");
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
    title="Konfirmasi Periode Pembayaran"
    class="max-w-lg"
  >
    <template #body>
      <div class="overflow-hidden">
        <div
          key="payment-info"
          class="flex flex-col items-center gap-5 text-center"
        >
          <div class="space-y-1">
            <p class="text-sm text-gray-500">
              Total yang harus dibayar
            </p>

            <p class="text-2xl font-semibold text-gray-900">
              {{ formattedNominal }}
            </p>
          </div>

          <div class="rounded-xl p-3 bg-white">
            <NuxtImg
              src="/images/contohqris.png"
              alt="QRIS Pembayaran"
              class="w-100 h-100 object-contain"
            />
          </div>

          <UButton
            to="/images/contohqris.png"
            target="_blank"
            download
            icon="i-lucide-download"
            variant="soft"
          >
            Download QRIS
          </UButton>

          <div class="text-xs text-gray-500 max-w-md leading-relaxed">
            Pastikan nominal transfer sesuai dengan total di atas.
            Setelah pembayaran, klik tombol konfirmasi dan tunggu verifikasi dari admin.
          </div>
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
        Konfirmasi Pembayaran
      </UButton>
    </template>
  </LazyUModal>
</template>
