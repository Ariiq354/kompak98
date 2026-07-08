<script setup lang="ts">
const props = defineProps<{
  breadcrumbs: { id: number | null; name: string; icon?: string }[];
}>();

const viewMode = defineModel<"grid" | "list">("viewMode", { default: "grid" });

const breadcrumbItems = computed(() => {
  return props.breadcrumbs.map(crumb => ({
    label: crumb.name,
    icon: crumb.icon,
    to: { query: { parentId: crumb.id || undefined } },
  }));
});
</script>

<template>
  <div class="flex items-center justify-between gap-4">
    <!-- Breadcrumbs -->
    <UBreadcrumb
      :items="breadcrumbItems"
      separator-icon="i-lucide-chevron-right"
      class="min-w-0 py-1"
    />

    <!-- View Mode -->
    <div class="flex items-center bg-elevated/40 p-1 rounded-xl border border-accented/50 shrink-0">
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
  </div>
</template>
