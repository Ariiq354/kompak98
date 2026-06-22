<script setup lang="ts">
import { MONTH_OPTION } from "~/utils/constant";

const props = withDefaults(defineProps<{
  availMonth?: number[];
}>(), {
  availMonth: undefined,
});

const monthIds = defineModel<number[]>({
  default: [],
});

const monthOptions = computed(() => {
  if (!props.availMonth?.length)
    return MONTH_OPTION;

  return MONTH_OPTION.filter(month =>
    props.availMonth!.includes(month.value),
  );
});

const allMonthIds = computed(() =>
  monthOptions.value.map(month => month.value),
);

const isAllSelected = computed(() => {
  if (!allMonthIds.value.length)
    return false;

  return allMonthIds.value.every(id => monthIds.value.includes(id));
});

function selectAll() {
  monthIds.value = [...allMonthIds.value];
}

function clearAll() {
  monthIds.value = [];
}

function toggleSelectAll() {
  if (isAllSelected.value) {
    clearAll();
    return;
  }

  selectAll();
}
</script>

<template>
  <div class="space-y-2">
    <div class="flex items-center gap-4 mb-4">
      <UButton
        size="xs"
        variant="soft"
        icon="i-lucide-calendar"
        @click="toggleSelectAll"
      >
        {{ isAllSelected ? "Batalkan Semua" : "Pilih Semua" }}
      </UButton>

      <span class="text-xs text-muted">
        {{ monthIds.length }} dipilih
      </span>
    </div>

    <USelectMenu
      v-model="monthIds"
      :items="monthOptions"
      value-key="value"
      label-key="label"
      multiple
      icon="i-lucide-calendar"
      placeholder="Pilih Bulan"
    />
  </div>
</template>
