<script lang="ts" setup>
import { useToastError, useToastSuccess } from "~/composables/toast";

const props = defineProps<{
  id?: number;
  pembayaran?: {
    id: number;
    nominal: number;
  };
  bulan?: number[];
  refresh: () => void;
}>();

const emit = defineEmits(["close"]);

const loading = ref(false);

const pembayaranId = ref<number | null>(props.pembayaran?.id ?? null);
const selectedMonths = ref<number[]>([]);
const nominal = ref(props.pembayaran?.nominal ?? 0);

const isStep2 = computed(() => pembayaranId.value !== null);
const isMonthSelectionInvalid = computed(() => selectedMonths.value.length === 0);

const formattedNominal = computed(() =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(nominal.value),
);

async function generatePembayaran() {
  if (isMonthSelectionInvalid.value)
    return;

  loading.value = true;
  try {
    const res = await $fetch("/api/v1/iuran/bulanan/pembayaran", {
      method: "POST",
      body: {
        iuranId: props.id,
        periode: selectedMonths.value,
      },
    });

    nominal.value = res.nominal;
    pembayaranId.value = res.pembayaranId;
    props.refresh();

    useToastSuccess("Sukses", "Silahkan scan kode yang tersedia");
  }
  catch (error: any) {
    useToastError("Gagal Konfirmasi Periode Pembayaran", error.data.message);
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
    await $fetch(`/api/v1/iuran/bulanan/${pembayaranId.value}/bayar`, {
      method: "PATCH",
    });

    props.refresh();
    emit("close", false);

    useToastSuccess("Sukses", "Silahkan tunggu verifikasi dari admin");
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
        <Transition name="fade-slide" mode="out-in">
          <div v-if="!isStep2" key="select-month">
            <InputMonth
              v-model="selectedMonths"
              :avail-month="bulan"
            />
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
        </Transition>
      </div>
    </template>

    <template #footer>
      <UButton
        icon="i-lucide-x"
        variant="ghost"
        :disabled="loading"
        @click="emit('close', false)"
      >
        Tutup
      </UButton>

      <Transition name="fade-button" mode="out-in">
        <UButton
          v-if="!isStep2"
          key="create-payment"
          icon="i-lucide-check"
          :loading="loading"
          :disabled="isMonthSelectionInvalid"
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
