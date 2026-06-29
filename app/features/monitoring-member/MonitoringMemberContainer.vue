<script setup lang="ts">
import type { QueryParams } from "./constants";
import { useToastError, useToastSuccess } from "~/composables/toast";
import { ObjectAssign } from "~/utils";
import { KODE_JABATAN_OPTIONS } from "./constants";

const query = ref<QueryParams>({
  page: 1,
  search: "",
  limit: 12,
  kodeJabatan: undefined,
});

const { data, status, refresh } = await useFetch("/api/v1/users", {
  query,
});

const config = useRuntimeConfig();

const isUpdatingRole = ref<Record<number, boolean>>({});

async function changeRole(userId: number, role: string) {
  if (role !== "admin" && role !== "user")
    return;
  isUpdatingRole.value[userId] = true;
  await authClient.admin.setRole({
    userId: userId.toString(),
    role,
  }, {
    onSuccess: async () => {
      isUpdatingRole.value[userId] = false;
      useToastSuccess("Berhasil", `Role berhasil diubah menjadi ${role}`);
      await refresh();
    },
    onError: (ctx) => {
      isUpdatingRole.value[userId] = false;
      useToastError("Gagal mengubah role", ctx.error.message || "Terjadi kesalahan saat mengubah role.");
    },
  });
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center gap-4">
      <InputSearch
        :model-value="query.search"
        class="max-w-md w-full"
        @update:model-value="ObjectAssign(query, { search: $event, page: 1 })"
      />
      <USelectMenu
        :model-value="query.kodeJabatan"
        :items="KODE_JABATAN_OPTIONS"
        placeholder="Pilih Jabatan"
        clear
        class="w-64"
        @update:model-value="ObjectAssign(query, { kodeJabatan: $event ?? undefined, page: 1 })"
      />
    </div>

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

      <template v-else-if="data?.data?.length === 0">
        <div class="col-span-full py-12 flex flex-col items-center justify-center text-center">
          <UIcon name="i-lucide-users" class="w-12 h-12 text-gray-400 mb-4" />
          <p class="text-lg font-medium text-gray-900 dark:text-white">
            Tidak ada data anggota
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Coba ganti kata kunci pencarian Anda.
          </p>
        </div>
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
            <div class="flex flex-col gap-3 w-full">
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-1.5">
                  <UIcon name="i-lucide-shield" class="w-4 h-4 text-gray-400" />
                  <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Role:</span>
                  <UBadge
                    :color="item.role === 'admin' ? 'error' : 'primary'"
                    variant="subtle"
                    size="sm"
                  >
                    {{ item.role || 'user' }}
                  </UBadge>
                </div>

                <USelectMenu
                  :model-value="item.role || 'user'"
                  :items="['user', 'admin']"
                  class="w-28"
                  size="xs"
                  :disabled="isUpdatingRole[item.id]"
                  @update:model-value="changeRole(item.id, $event)"
                />
              </div>

              <UButton
                block
                variant="soft"
                icon="i-lucide-user-search"
                :to="`/dashboard/admin/monitoring-member/${item.id}`"
              >
                Detail Profil
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </div>

    <!-- Pagination -->
    <div v-if="data?.total" class="flex items-center justify-center md:justify-between border-t border-gray-100 dark:border-gray-800 pt-6">
      <p class="text-sm text-gray-500 dark:text-gray-400 hidden md:block">
        Menampilkan {{ (query.page - 1) * query.limit + 1 }} sampai
        {{ Math.min(query.page * query.limit, data?.total) }} dari {{ data?.total }} anggota
      </p>
      <div class="flex justify-center">
        <UPagination
          v-model:page="query.page"
          :total="data?.total"
          :items-per-page="query.limit"
        />
      </div>
    </div>
  </div>
</template>
