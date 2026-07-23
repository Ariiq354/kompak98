<script setup lang="ts">
import { useAuthSession } from "~/composables/auth";

import { formatBytes, formatDate, getFileIcon, isImage } from "../utils/helpers";

defineProps<{
  folders: any[];
  files: any[];
  isAdmin: boolean;
}>();

defineEmits<{
  (e: "navigate", id: number | null): void;
  (e: "preview", file: any): void;
  (e: "copyLink", file: any): void;
  (e: "rename", item: any): void;
  (e: "delete", item: any): void;
}>();

const config = useRuntimeConfig();
const { session } = await useAuthSession();
</script>

<template>
  <div class="border border-accented rounded-2xl overflow-hidden bg-elevated/10">
    <div class="overflow-x-auto">
      <table class="w-full border-collapse text-left bg-white">
        <thead>
          <tr class="border-b border-accented bg-elevated/30 text-xs font-bold text-dimmed uppercase tracking-wider">
            <th class="py-3 px-4 w-1/2">
              Nama
            </th>
            <th class="py-3 px-4 text-center">
              Ukuran
            </th>
            <th class="py-3 px-4 text-center">
              Tipe
            </th>
            <th class="py-3 px-4 text-center">
              Tanggal Upload
            </th>
            <th class="py-3 px-4 text-center">
              Pengunggah
            </th>
            <th class="py-3 px-4 text-center">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-accented/60 text-sm">
          <!-- Folders in List View -->
          <tr
            v-for="folder in folders"
            :key="folder.id"
            class="hover:bg-elevated/35 hover:dark:bg-elevated/10 transition-colors cursor-pointer group"
            @click="$emit('navigate', folder.id)"
          >
            <td class="py-3 px-4 font-semibold h-full text-default">
              <div class="flex items-center gap-3">
                <UIcon name="i-lucide-folder" class="w-5 h-5" />
                <div class="truncate max-w-xs md:max-w-md">
                  {{ folder.name }}
                </div>
              </div>
            </td>
            <td class="py-3 px-4 text-dimmed font-medium text-center">
              -
            </td>
            <td class="py-3 px-4 text-dimmed font-medium text-center">
              Folder
            </td>
            <td class="py-3 px-4 text-dimmed font-medium text-center">
              {{ formatDate(folder.createdAt) }}
            </td>
            <td class="py-3 px-4 text-dimmed font-medium text-center">
              <div class="inline-flex items-center gap-2">
                <UAvatar
                  :src="folder.creatorImage ? `${config.public.imageUrl}/${folder.creatorImage}` : undefined"
                  :alt="folder.creatorName ?? 'User'"
                  size="xs"
                />
                <span class="text-xs text-dimmed">{{ folder.creatorName ?? 'User' }}</span>
              </div>
            </td>
            <td class="py-3 px-4 text-center" @click.stop>
              <div v-if="isAdmin || Number(session?.user.id) === folder.createdBy" class="inline-flex items-center gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity">
                <UButton
                  icon="i-lucide-pencil"
                  variant="ghost"
                  color="neutral"
                  size="sm"
                  class="cursor-pointer"
                  @click="$emit('rename', folder)"
                />
                <UButton
                  icon="i-lucide-trash"
                  variant="ghost"
                  color="error"
                  size="sm"
                  class="cursor-pointer"
                  @click="$emit('delete', folder)"
                />
              </div>
            </td>
          </tr>

          <!-- Files in List View -->
          <tr
            v-for="file in files"
            :key="file.id"
            class="hover:bg-elevated/35 hover:dark:bg-elevated/10 transition-colors cursor-pointer group"
            @click="$emit('preview', file)"
          >
            <td class="py-3 px-4 font-semibold text-default flex items-center gap-3">
              <!-- Mini Icon/Thumbnail -->
              <div v-if="isImage(file.extension) && file.path" class="w-8 h-8 rounded-lg overflow-hidden border border-accented bg-neutral-900 shrink-0">
                <NuxtImg
                  :src="`${config.public.imageUrl}/${file.path}`"
                  :alt="file.name"
                  class="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div
                v-else
                class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                :class="[getFileIcon(file.extension).color]"
              >
                <UIcon :name="getFileIcon(file.extension).icon" class="w-4.5 h-4.5" />
              </div>
              <span class="truncate max-w-xs md:max-w-md" :title="file.name">{{ file.name }}</span>
            </td>
            <td class="py-3 px-4 text-dimmed font-medium text-center">
              {{ formatBytes(file.size) }}
            </td>
            <td class="py-3 px-4 text-dimmed font-medium uppercase text-center">
              {{ file.extension || 'FILE' }}
            </td>
            <td class="py-3 px-4 text-dimmed font-medium text-center">
              {{ formatDate(file.createdAt) }}
            </td>
            <td class="py-3 px-4 text-dimmed font-medium text-center">
              <div class="inline-flex items-center gap-2">
                <UAvatar
                  :src="file.creatorImage ? `${config.public.imageUrl}/${file.creatorImage}` : undefined"
                  :alt="file.creatorName ?? 'User'"
                  size="xs"
                />
                <span class="text-xs text-dimmed">{{ file.creatorName ?? 'User' }}</span>
              </div>
            </td>
            <td class="py-3 px-4 text-center" @click.stop>
              <div class="inline-flex items-center gap-1">
                <UButton
                  icon="i-lucide-copy"
                  variant="ghost"
                  color="neutral"
                  size="sm"
                  class="cursor-pointer md:opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Salin Link"
                  @click="$emit('copyLink', file)"
                />
                <UButton
                  as="a"
                  :href="`${config.public.imageUrl}/${file.path}`"
                  target="_blank"
                  download
                  icon="i-lucide-download"
                  variant="ghost"
                  color="neutral"
                  size="sm"
                  class="cursor-pointer md:opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Download"
                />
                <div v-if="isAdmin || Number(session?.user.id) === file.createdBy" class="inline-flex items-center gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity">
                  <UButton
                    icon="i-lucide-pencil"
                    variant="ghost"
                    color="neutral"
                    size="sm"
                    class="cursor-pointer"
                    @click="$emit('rename', file)"
                  />
                  <UButton
                    icon="i-lucide-trash"
                    variant="ghost"
                    color="error"
                    size="sm"
                    class="cursor-pointer"
                    @click="$emit('delete', file)"
                  />
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
