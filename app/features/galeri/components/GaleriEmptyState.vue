<script setup lang="ts">
defineProps<{
  search: string;
  filterType: string;
  isAdmin: boolean;
}>();

defineEmits<{
  (e: "createFolder"): void;
  (e: "uploadFile"): void;
}>();
</script>

<template>
  <div class="flex flex-col items-center justify-center p-12 bg-elevated/10 border border-dashed border-accented rounded-2xl text-center min-h-75">
    <div class="p-4 bg-primary/5 rounded-full aspect-square text-primary mb-4 animate-bounce">
      <UIcon name="i-lucide-folder-open" class="w-12 h-12" />
    </div>
    <h3 class="text-lg font-bold text-default">
      {{ search || filterType !== 'all' ? 'Pencarian tidak ditemukan' : 'Folder ini Kosong' }}
    </h3>
    <p class="text-sm text-dimmed max-w-sm mt-1">
      {{ search || filterType !== 'all' ? 'Coba ganti kata kunci pencarian atau ganti tipe filter Anda.' : 'Belum ada folder atau file yang di-upload di direktori ini.' }}
    </p>
    <div v-if="isAdmin && !search && filterType === 'all'" class="mt-4 flex gap-2">
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
  </div>
</template>
