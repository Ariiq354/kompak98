<script setup lang="ts">
import type { CalendarDate } from "@internationalized/date";
import { formatTanggal } from "~/utils";

defineProps<{
  disabled?: boolean;
}>();

const tanggal = defineModel<CalendarDate>();
</script>

<template>
  <UPopover>
    <UButton
      color="neutral"
      variant="outline"
      icon="i-lucide-calendar"
      :label=" tanggal ? formatTanggal(tanggal) : 'Pilih Tanggal'"
      :disabled="disabled"
      class="w-full justify-start"
    />

    <template #content>
      <UCalendar v-model="tanggal" class="p-2" locale="id-ID" />
    </template>
  </UPopover>
</template>
