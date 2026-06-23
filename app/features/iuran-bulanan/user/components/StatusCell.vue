<script setup lang="ts">
const props = defineProps<{
  row: any;
  bulan: number;
}>();

const PAYMENT_STATUS_CONFIG = {
  lunas: {
    icon: "i-lucide-check",
    class: "bg-primary text-white",
    label: "Sudah dibayar",
  },
  menunggu_verifikasi: {
    icon: "i-lucide-hourglass",
    class: "bg-red-50 text-red-400",
    label: "Menunggu verifikasi",
  },
  pending: {
    icon: "i-lucide-clock-4",
    class: "bg-yellow-50 text-orange-400",
    label: "Menunggu pembayaran",
  },
} as const;

const DEFAULT_STATUS_CONFIG = {
  icon: "i-lucide-minus",
  class: "bg-gray-100 text-gray-600",
  label: "Belum ada pembayaran",
} as const;

function getStatusConfig(status?: string) {
  return PAYMENT_STATUS_CONFIG[status as keyof typeof PAYMENT_STATUS_CONFIG]
    ?? DEFAULT_STATUS_CONFIG;
}
function getStatusBulan(row: any, bulan: number) {
  return row.original.bulan?.find((item: any) => item.bulan === bulan)?.status;
}
const currentStatus = computed(() => {
  const status = getStatusBulan(props.row, props.bulan);
  return getStatusConfig(status);
});
</script>

<template>
  <UTooltip
    :text="currentStatus.label"
    :content="{
      align: 'center',
      side: 'top',
      sideOffset: 8,
    }"
  >
    <div
      class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md"
      :class="[currentStatus.class]"
    >
      <UIcon
        :name="currentStatus.icon"
        class="h-4 w-4"
      />
    </div>
  </UTooltip>
</template>
