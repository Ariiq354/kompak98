<script setup lang="ts">
defineProps<{
  search: string;
}>();

defineEmits<{
  (e: "createFolder"): void;
  (e: "uploadFile"): void;
}>();
</script>

<template>
  <UEmpty
    icon="i-lucide-folder-open"
    :title="search ? 'Pencarian tidak ditemukan' : 'Folder ini Kosong'"
    :description="search ? 'Coba ganti kata kunci pencarian.' : 'Belum ada folder atau file yang di-upload di direktori ini.'"
    class="p-12 bg-elevated/10 border border-dashed border-accented rounded-2xl min-h-75"
  >
    <template #actions>
      <div v-if="!search" class="flex gap-2">
        <UButton
          size="sm"
          variant="subtle"
          icon="i-lucide-folder-plus"
          class="cursor-pointer"
          @click="$emit('createFolder')"
        >
          Buat Folder
        </UButton>
        <UButton
          size="sm"
          icon="i-lucide-upload"
          class="text-white cursor-pointer"
          @click="$emit('uploadFile')"
        >
          Upload File
        </UButton>
      </div>
    </template>
  </UEmpty>
</template>
