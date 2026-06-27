<script setup lang="ts">
import type { QueryParams } from "../constants";
import { ObjectAssign } from "~/utils";
import { MONTH_OPTION, YEAR_OPTION } from "~/utils/constant";

const openModel = defineModel<boolean>("open");

const filterModel = defineModel<QueryParams>("query", {
  required: true,
});
</script>

<template>
  <UModal v-model:open="openModel" title="Filter">
    <template #body>
      <div class="flex flex-col gap-4">
        <USelectMenu
          :model-value="filterModel.tahun"
          :items="YEAR_OPTION"
          placeholder="Pilih Tahun"
          clear
          @update:model-value="ObjectAssign(filterModel!, { tahun: $event ?? undefined, page: 1 })"
        />
        <USelectMenu
          :model-value="filterModel.bulan"
          :items="MONTH_OPTION"
          label-key="label"
          value-key="value"
          placeholder="Pilih Bulan"
          clear
          @update:model-value="ObjectAssign(filterModel!, { bulan: $event ?? undefined, page: 1 })"
        />
      </div>
    </template>
  </UModal>
</template>
