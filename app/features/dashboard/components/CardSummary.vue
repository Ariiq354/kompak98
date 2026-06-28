<script setup lang="ts">
defineProps<{
  title: string;
  total: number;
  icon: string;
  iconColor?: string;
  bgIcon?: string;
  details?: Record<string, number>;
}>();
</script>

<template>
  <UCard
    class="flex-none"
    :ui="{
      body: 'p-5',
    }"
  >
    <div class="flex items-start justify-between gap-4">
      <div class="min-w-0">
        <p class="text-sm text-muted">
          {{ title }}
        </p>

        <p class="mt-2 text-3xl font-bold tracking-tight">
          {{ total }}
        </p>
      </div>

      <div
        class="flex size-12 shrink-0 items-center justify-center rounded-xl"
        :class="bgIcon"
      >
        <UIcon
          :name="icon"
          class="size-6"
          :class="iconColor"
        />
      </div>
    </div>

    <div
      v-if="details && Object.keys(details).length"
      class="mt-5 border-t border-default pt-4"
    >
      <div class="space-y-2">
        <div
          v-for="(value, key) in details"
          :key="key"
          class="flex items-center justify-between text-sm"
        >
          <span class="text-muted">
            {{ key }}
          </span>

          <UBadge
            color="neutral"
            variant="soft"
          >
            {{ value }}
          </UBadge>
        </div>
      </div>
    </div>
  </UCard>
</template>
