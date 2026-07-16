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
  <div class="space-y-6">
    <!-- Folders Section -->
    <div v-if="folders.length > 0" class="space-y-3">
      <h3 class="text-xs font-bold text-dimmed uppercase tracking-wider px-1">
        Folder ({{ folders.length }})
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div
          v-for="folder in folders"
          :key="folder.id"
          class="group flex items-center justify-between p-3.5 bg-white border border-accented/80 hover:border-primary/30 rounded-xl cursor-pointer hover:shadow-sm transition-all duration-200"
          @click="$emit('navigate', folder.id)"
        >
          <div class="flex items-center gap-3 min-w-0 pr-2">
            <UIcon name="i-lucide-folder" class="w-6 h-6 shrink-0" />
            <span class="text-sm font-semibold truncate text-default">
              {{ folder.name }}
            </span>
          </div>

          <!-- Actions -->
          <div v-if="isAdmin" class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" @click.stop>
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
        </div>
      </div>
    </div>

    <!-- Files Section -->
    <div v-if="files.length > 0" class="space-y-3">
      <h3 class="text-xs font-bold text-dimmed uppercase tracking-wider px-1">
        File ({{ files.length }})
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div
          v-for="file in files"
          :key="file.id"
          class="group flex flex-col bg-white border border-accented/80 hover:border-primary/30 rounded-2xl overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer"
          @click="$emit('preview', file)"
        >
          <!-- Thumbnail / File Type Display -->
          <div
            class="aspect-video w-full bg-elevated/40 relative flex items-center justify-center overflow-hidden border-b border-accented/50"
          >
            <!-- Real Image Preview -->
            <NuxtImg
              v-if="isImage(file.extension) && file.path"
              :src="`${config.public.imageUrl}/${file.path}`"
              :alt="file.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />

            <!-- Other File Icons -->
            <div
              v-else
              class="p-5 rounded-2xl flex items-center justify-center"
              :class="[getFileIcon(file.extension).color]"
            >
              <UIcon :name="getFileIcon(file.extension).icon" class="w-10 h-10" />
            </div>

            <!-- Quick Hover Controls (Download, Copy Link) -->
            <div
              class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2.5 transition-opacity duration-200"
            >
              <UButton
                icon="i-lucide-copy"
                class="rounded-full h-10 w-10 flex items-center justify-center bg-white text-black hover:bg-neutral-100 cursor-pointer shadow-sm"
                size="sm"
                title="Salin Link"
                @click.stop="$emit('copyLink', file)"
              />
              <UButton
                as="a"
                :href="`${config.public.imageUrl}/${file.path}`"
                target="_blank"
                download
                icon="i-lucide-download"
                class="rounded-full h-10 w-10 flex items-center justify-center bg-white text-black hover:bg-neutral-100 cursor-pointer shadow-sm"
                size="sm"
                title="Download File"
                @click.stop
              />
            </div>

            <!-- Extension Badge -->
            <span class="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-neutral-900/80 backdrop-blur-md text-white border border-white/10 uppercase tracking-wider">
              {{ file.extension || 'FILE' }}
            </span>
          </div>

          <!-- Details -->
          <div class="p-3.5 flex flex-col justify-between flex-1 gap-2">
            <div class="min-w-0 flex">
              <div class="flex-1">
                <p class="text-sm font-semibold truncate text-default" :title="file.name">
                  {{ file.name }}
                </p>
                <div class="flex items-center gap-2 mt-1">
                  <span class="text-xs text-dimmed">
                    {{ formatBytes(file.size) }}
                  </span>
                  <span class="text-[10px] text-border">•</span>
                  <span class="text-xs text-dimmed">
                    {{ formatDate(file.createdAt) }}
                  </span>
                </div>
              </div>
              <div class="flex items-center">
                <UTooltip :text="file.creatorName">
                  <UAvatar
                    :src="file.creatorImage ? `${config.public.imageUrl}/${file.creatorImage}` : undefined"
                    :alt="file.creatorName ?? 'User'"
                  />
                </UTooltip>
              </div>
            </div>

            <!-- Extra actions footer -->
            <div
              v-if="isAdmin || Number(session?.user.id) === file.createdBy"
              class="flex items-center justify-end mt-1 pt-2 border-t border-accented/40"
              @click.stop
            >
              <div class="flex items-center gap-0.5">
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
