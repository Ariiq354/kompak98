<script setup lang="ts">
import InputSearch from "~/components/Custom/InputSearch.vue";
import { MONTH_OPTION, YEAR_OPTION } from "~/utils/constant";

defineEmits<{
  (e: "createFolder"): void;
  (e: "uploadFile"): void;
}>();

const search = defineModel<string>("search", { default: "" });
const tahun = defineModel<number | undefined>("tahun");
const bulan = defineModel<number | undefined>("bulan");
</script>

<template>
  <div class="flex items-center justify-between gap-4">
    <!-- Filter bar -->
    <div class="flex-1 flex items-center gap-2">
      <InputSearch
        v-model="search"
      />
      <USelectMenu
        v-model="tahun"
        :items="YEAR_OPTION"
        placeholder="Pilih Tahun"
        clear
        class="hidden flex-1 md:flex"
      />
      <USelectMenu
        v-model="bulan"
        placeholder="Pilih Bulan"
        clear
        :items="MONTH_OPTION"
        label-key="label"
        value-key="value"
        class="hidden flex-1 md:flex"
      />
    </div>

    <div class="flex items-center gap-2.5 shrink-0">
      <UButton
        icon="i-lucide-folder-plus"
        variant="subtle"
        class="cursor-pointer font-semibold"
        @click="$emit('createFolder')"
      >
        <span class="hidden sm:inline">Buat Folder</span>
      </UButton>
      <UButton
        icon="i-lucide-upload"
        class="text-white bg-primary hover:bg-primary/95 shadow-sm cursor-pointer font-semibold"
        @click="$emit('uploadFile')"
      >
        <span class="hidden sm:inline">Upload File</span>
      </UButton>
    </div>
  </div>
</template>
