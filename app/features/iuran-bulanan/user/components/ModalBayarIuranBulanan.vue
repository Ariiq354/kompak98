<script lang="ts" setup>
import { useToastError } from "~/composables/toast";

const props = defineProps<{
  path: string;
  id: number;
  pendingPayment: number[];
  refresh: () => void;
}>();

const emit = defineEmits(["close"]);

const loading = ref(false);

const pembayaranId = ref<number | null>(null);
const selectedMonths = ref<number[]>([]);
const nominal = ref(0);
const formattedNominal = computed(() =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(nominal.value),
);

async function generatePembayaran() {
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

async function onClick() {
  if (!pembayaranId.value)
    return;

  loading.value = true;

  try {
    await $fetch(`/api/v1/iuran/bulanan/${pembayaranId.value}/bayar`, {
      method: "PATCH",
    });

    props.refresh();
    emit("close", false);

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
    :close="{ onClick: () => emit('close', false) }"
    title="Konfirmasi Periode Pembayaran"
    class="max-w-lg"
  >
    <template #body>
      <div class="overflow-hidden">
        <Transition name="fade-slide" mode="out-in">
          <div v-if="nominal === 0" key="select-month">
            <InputMonth
              v-model="selectedMonths"
              :avail-month="pendingPayment"
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
        Batal
      </UButton>

      <Transition name="fade-button" mode="out-in">
        <UButton
          v-if="nominal === 0"
          key="confirm-period"
          icon="i-lucide-check"
          :loading="loading"
          class="bg-green-500 hover:bg-green-400 active:bg-green-400 cursor-pointer"
          @click="generatePembayaran"
        >
          Konfirmasi Periode
        </UButton>

        <UButton
          v-else
          key="confirm-payment"
          icon="i-lucide-check"
          :loading="loading"
          @click="onClick"
        >
          Konfirmasi Pembayaran
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
