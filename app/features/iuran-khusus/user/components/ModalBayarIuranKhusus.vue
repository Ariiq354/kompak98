<script lang="ts" setup>
import { useToastError } from "~/composables/toast";

const props = defineProps<{
  id?: number;
  pembayaran?: {
    id: number;
    nominal: number;
  };
  nominalAnjuran?: number;
  refresh: () => void;
}>();

const emit = defineEmits<{ close: [] }>();

const loading = ref(false);

const pembayaranId = ref<number | null>(props.pembayaran?.id ?? null);
const nominalInput = ref<number | null>(null);
const nominal = ref(props.pembayaran?.nominal ?? 0);

const isStep2 = computed(() => !!props.pembayaran || !!pembayaranId.value);

const formattedNominal = computed(() =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(nominal.value),
);

const formattedAnjuranNominal = computed(() =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(props.nominalAnjuran ?? 0),
);

async function generatePembayaran() {
  if (!nominalInput.value)
    return useToastError("Gagal", "Nominal iuran wajib diisi");

  loading.value = true;

  try {
    const res = await $fetch("/api/v1/iuran/khusus/me/pembayaran", {
      method: "POST",
      body: {
        iuranId: props.id,
        nominal: nominalInput.value,
      },
    });

    nominal.value = res.nominal;
    pembayaranId.value = res.pembayaranId;

    props.refresh();

    useToastSuccess("Sukses", "Silahkan scan kode yang tersedia");
  }
  catch (error: any) {
    useToastError("Gagal Konfirmasi Pembayaran", error.data.message);
  }
  finally {
    loading.value = false;
  }
}

async function confirmPembayaran() {
  if (!pembayaranId.value)
    return;

  loading.value = true;

  try {
    await $fetch(`/api/v1/iuran/khusus/me/${pembayaranId.value}/bayar`, {
      method: "PATCH",
    });

    props.refresh();
    emit("close");

    useToastSuccess("Sukses", "Silahkan tunggu konfirmasi status pembayaran");
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
    title="Konfirmasi Pembayaran Iuran Khusus"
    class="max-w-lg"
  >
    <template #body>
      <Transition name="fade-slide" mode="out-in">
        <div v-if="!isStep2" key="input-nominal">
          <UFormField
            label="Input Nominal Iuran"
          >
            <UInputNumber
              v-model="nominalInput"
              orientation="vertical"
              :placeholder="`Anjuran Iuran ${formattedAnjuranNominal}`"
            />
          </UFormField>
        </div>

        <div
          v-else
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

          <div class="rounded-xl bg-white p-3">
            <NuxtImg
              src="/images/contohqris.png"
              alt="QRIS Pembayaran"
              class="h-100 w-100 object-contain"
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

          <div class="max-w-md text-xs leading-relaxed text-gray-500">
            Pastikan nominal transfer sesuai dengan total di atas.
            Setelah pembayaran, klik tombol konfirmasi dan tunggu verifikasi dari admin.
          </div>
        </div>
      </Transition>
    </template>

    <template #footer>
      <UButton
        icon="i-lucide-x"
        variant="ghost"
        :disabled="loading"
        @click="emit('close')"
      >
        Tutup
      </UButton>

      <Transition name="fade-button" mode="out-in">
        <UButton
          v-if="!isStep2"
          key="confirm-nominal"
          icon="i-lucide-check"
          :loading="loading"
          class="cursor-pointer"
          @click="generatePembayaran"
        >
          Konfirmasi
        </UButton>

        <UButton
          v-else
          key="confirm-payment"
          icon="i-lucide-check"
          :loading="loading"
          @click="confirmPembayaran"
        >
          Konfirmasi
        </UButton>
      </Transition>
    </template>
  </LazyUModal>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    opacity 220ms ease,
    transform 220ms ease,
    max-height 260ms ease;
  overflow: hidden;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(8px);
  max-height: 0;
}

.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
  max-height: 600px;
}

.fade-button-enter-active,
.fade-button-leave-active {
  transition:
    opacity 180ms ease,
    transform 180ms ease;
}

.fade-button-enter-from,
.fade-button-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

.fade-button-enter-to,
.fade-button-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
