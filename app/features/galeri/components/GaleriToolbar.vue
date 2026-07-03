<script setup lang="ts">
defineEmits<{
  (e: "refresh"): void;
}>();
const search = defineModel<string>("search", { default: "" });
const filterType = defineModel<"all" | "image" | "video" | "document" | "archive">("filterType", { default: "all" });
const viewMode = defineModel<"grid" | "list">("viewMode", { default: "grid" });
</script>

<template>
  <UCard class="rounded-2xl shadow-sm">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <!-- Search bar -->
      <div class="w-full md:w-72">
        <UInput
          v-model="search"
          placeholder="Cari file atau folder..."
          icon="i-lucide-search"
          clear
          class="w-full"
        />
      </div>

      <!-- Local Categorization Tabs -->
      <div class="flex items-center bg-elevated/40 p-1 rounded-xl border border-accented/50 overflow-x-auto max-w-full">
        <button
          v-for="tab in [
            { value: 'all', label: 'Semua', icon: 'i-lucide-layout-grid' },
            { value: 'image', label: 'Gambar', icon: 'i-lucide-image' },
            { value: 'video', label: 'Video', icon: 'i-lucide-film' },
            { value: 'document', label: 'Dokumen', icon: 'i-lucide-file-text' },
            { value: 'archive', label: 'Arsip', icon: 'i-lucide-archive' },
          ]"
          :key="tab.value"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
          :class="[
            filterType === tab.value
              ? 'bg-primary text-white shadow-sm'
              : 'text-dimmed hover:text-default hover:bg-elevated/60',
          ]"
          @click="filterType = tab.value"
        >
          <UIcon :name="tab.icon" class="w-3.5 h-3.5" />
          <span>{{ tab.label }}</span>
        </button>
      </div>

      <!-- View Mode and Refresh -->
      <div class="flex items-center gap-3 justify-end">
        <div class="flex items-center bg-elevated/40 p-1 rounded-xl border border-accented/50">
          <button
            class="p-1.5 rounded-lg cursor-pointer transition-all flex items-center"
            :class="[viewMode === 'grid' ? 'bg-primary text-white shadow-sm' : 'text-dimmed hover:text-default']"
            title="Grid View"
            @click="viewMode = 'grid'"
          >
            <UIcon name="i-lucide-grid" class="w-4 h-4" />
          </button>
          <button
            class="p-1.5 rounded-lg cursor-pointer transition-all flex items-center"
            :class="[viewMode === 'list' ? 'bg-primary text-white shadow-sm' : 'text-dimmed hover:text-default']"
            title="List View"
            @click="viewMode = 'list'"
          >
            <UIcon name="i-lucide-list" class="w-4 h-4" />
          </button>
        </div>
        <UButton
          icon="i-lucide-refresh-cw"
          variant="ghost"
          color="primary"
          class="cursor-pointer"
          title="Refresh"
          @click="$emit('refresh')"
        />
      </div>
    </div>
  </UCard>
</template>
