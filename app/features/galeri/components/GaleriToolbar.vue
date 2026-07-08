<script setup lang="ts">
import InputSearch from "~/components/Custom/InputSearch.vue";

defineProps<{
  isAdmin: boolean;
}>();

defineEmits<{
  (e: "createFolder"): void;
  (e: "uploadFile"): void;
}>();

const search = defineModel<string>("search", { default: "" });
</script>

<template>
  <div class="flex items-center justify-between gap-4">
    <!-- Search bar -->
    <div class="flex-1 min-w-0">
      <InputSearch
        v-model="search"
        class="w-full"
      />
    </div>

    <!-- Admin Actions (Create Folder & Upload File) -->
    <div v-if="isAdmin" class="flex items-center gap-2.5 shrink-0">
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
