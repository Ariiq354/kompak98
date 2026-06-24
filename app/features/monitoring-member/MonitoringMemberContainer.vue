<script setup lang="ts">
const query = ref<PageSearch>({
  page: 1,
  search: "",
});

const { data, status } = await useFetch("/api/v1/users/monitoring", {
  query,
});

const config = useRuntimeConfig();
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <template v-if="status === 'pending'">
      <UCard v-for="i in 6" :key="i">
        <div class="flex gap-4">
          <USkeleton class="w-14 h-14 rounded-full shrink-0" />
          <div class="space-y-2 w-full mt-2">
            <USkeleton class="h-4 w-3/4" />
            <USkeleton class="h-3 w-1/2" />
          </div>
        </div>
        <div class="space-y-3 mt-6">
          <USkeleton v-for="j in 4" :key="j" class="h-4 w-full" />
        </div>
        <template #footer>
          <USkeleton class="h-8 w-full" />
        </template>
      </UCard>
    </template>

    <template v-else>
      <UCard
        v-for="item in data?.data"
        :key="item.id"
        class="flex flex-col transition-all hover:shadow-lg"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex gap-4 min-w-0">
            <UAvatar :alt="item.name" class="size-14" :src="`${config.public.imageUrl}/${item.foto}`" />

            <div class="min-w-0 mt-1">
              <p class="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {{ item.name }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400 truncate">
                NIP. {{ item.nip18 || item.nip9 || '-' }}
              </p>
            </div>
          </div>

          <UBadge
            v-if="item.namaPangkat"
            color="neutral"
            variant="soft"
            class="shrink-0"
          >
            {{ item.namaPangkat }}
          </UBadge>
        </div>

        <div class="flex flex-col gap-3 mt-6 text-sm text-gray-600 dark:text-gray-300">
          <div class="flex items-center gap-3">
            <UIcon name="i-lucide-graduation-cap" class="w-4 h-4 shrink-0 text-gray-400" />
            <span class="truncate">{{ item.pendidikanFormal || '-' }}</span>
          </div>
          <div class="flex items-center gap-3">
            <UIcon name="i-lucide-briefcase" class="w-4 h-4 shrink-0 text-gray-400" />
            <span class="truncate">{{ item.namaJabatan || '-' }}</span>
          </div>
          <div class="flex items-center gap-3">
            <UIcon name="i-lucide-building-2" class="w-4 h-4 shrink-0 text-gray-400" />
            <span class="truncate">{{ item.namaKantor || '-' }}</span>
          </div>
          <div class="flex items-center gap-3">
            <UIcon name="i-lucide-phone" class="w-4 h-4 shrink-0 text-gray-400" />
            <span class="truncate">{{ item.noHp || '-' }}</span>
          </div>
        </div>

        <template #footer>
          <UButton
            block
            variant="soft"
            icon="i-lucide-user-search"
            :to="`/dashboard/admin/monitoring-member/${item.id}`"
          >
            Detail Profil
          </UButton>
        </template>
      </UCard>
    </template>
  </div>
</template>
