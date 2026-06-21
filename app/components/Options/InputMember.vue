<script setup lang="ts">
const props = defineProps<{
  disabled?: boolean;
}>();

const userIds = defineModel<number[]>({
  required: true,
});

const { data: users, status } = await useLazyFetch("/api/v1/users", {
  transform: data =>
    data?.map(user => ({
      label: user.name,
      value: user.id,
      avatar: {
        alt: user.name,
        src: user.image
          ? `https://pub-ff64f896e7f947fbb8d492e462d142e3.r2.dev/${user.image}`
          : undefined,
        loading: "lazy" as const,
      },
    })),
});

const allUserIds = computed(() =>
  users.value?.map(user => user.value) ?? [],
);

const isAllSelected = computed(() => {
  if (!allUserIds.value.length)
    return false;

  return allUserIds.value.every(id => userIds.value.includes(id));
});

function selectAll() {
  userIds.value = [...allUserIds.value];
}

function clearAll() {
  userIds.value = [];
}

function toggleSelectAll() {
  if (isAllSelected.value) {
    clearAll();
    return;
  }

  selectAll();
}
</script>

<template>
  <div class="space-y-2">
    <div class="flex items-center gap-2">
      <UButton
        size="xs"
        variant="soft"
        icon="i-lucide-users"
        :disabled="props.disabled || status === 'pending'"
        @click="toggleSelectAll"
      >
        {{ isAllSelected ? "Batalkan Semua" : "Pilih Semua" }}
      </UButton>

      <span class="text-xs text-muted">
        {{ userIds.length }} dipilih
      </span>
    </div>

    <USelectMenu
      v-model="userIds"
      :items="users"
      value-key="value"
      multiple
      icon="i-lucide-user"
      placeholder="Select member"
      :loading="status === 'pending'"
      :disabled="props.disabled"
    />
  </div>
</template>
