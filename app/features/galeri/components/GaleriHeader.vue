<script setup lang="ts">
defineProps<{
  breadcrumbs: { id: number | null; name: string; icon?: string }[];
  isAdmin: boolean;
}>();

defineEmits<{
  (e: "navigate", id: number | null): void;
  (e: "createFolder"): void;
  (e: "uploadFile"): void;
}>();
</script>

<template>
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <!-- Breadcrumbs -->
    <nav class="flex items-center gap-1.5 overflow-x-auto min-w-0 py-1" aria-label="Breadcrumb">
      <div
        v-for="(crumb, idx) in breadcrumbs"
        :key="crumb.id ?? 'root'"
        class="flex items-center gap-1.5 shrink-0 text-sm"
      >
        <UIcon v-if="idx > 0" name="i-lucide-chevron-right" class="text-dimmed w-4 h-4" />

        <button
          class="flex items-center gap-1 font-semibold px-3 py-1.5 rounded-xl hover:bg-elevated/60 text-dimmed hover:text-default transition-all border border-transparent hover:border-accented/30 cursor-pointer"
          :class="{ 'text-primary! bg-primary/5 border-primary/20 font-bold': idx === breadcrumbs.length - 1 }"
          @click="$emit('navigate', crumb.id)"
        >
          <UIcon v-if="crumb.icon" :name="crumb.icon" class="w-4 h-4" />
          <span>{{ crumb.name }}</span>
        </button>
      </div>
    </nav>

    <!-- Admin Actions (Create Folder & Upload File) -->
    <div v-if="isAdmin" class="flex items-center gap-2.5">
      <UButton
        icon="i-lucide-folder-plus"
        variant="subtle"
        class="cursor-pointer font-semibold"
        @click="$emit('createFolder')"
      >
        Buat Folder
      </UButton>
      <UButton
        icon="i-lucide-upload"
        class="text-white bg-primary hover:bg-primary/95 shadow-sm cursor-pointer font-semibold"
        @click="$emit('uploadFile')"
      >
        Upload File
      </UButton>
    </div>
  </div>
</template>
