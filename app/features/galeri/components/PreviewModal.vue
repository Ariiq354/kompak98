<script setup lang="ts">
import { useClipboard } from "@vueuse/core";
import { useToastSuccess } from "~/composables/toast";

const props = defineProps<{
  item: any;
}>();

const open = defineModel<boolean>("open", {
  required: true,
});

const config = useRuntimeConfig();
const { copy, copied } = useClipboard({ legacy: true });

const fileUrl = computed(() => {
  if (!props.item?.path)
    return "";
  return `${config.public.imageUrl}/${props.item.path}`;
});

function isImage(ext: string | null | undefined) {
  if (!ext)
    return false;
  return ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext.toLowerCase());
}

function isVideo(ext: string | null | undefined) {
  if (!ext)
    return false;
  return ["mp4", "webm", "ogg", "avi", "mov"].includes(ext.toLowerCase());
}

function isAudio(ext: string | null | undefined) {
  if (!ext)
    return false;
  return ["mp3", "wav", "aac", "flac"].includes(ext.toLowerCase());
}

function isPdf(ext: string | null | undefined) {
  if (!ext)
    return false;
  return ["pdf"].includes(ext.toLowerCase());
}

function handleCopyLink() {
  if (fileUrl.value) {
    copy(fileUrl.value);
    useToastSuccess("Salin Link", "Link file berhasil disalin");
  }
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="item?.name || 'Preview File'"
    class="max-w-3xl"
  >
    <template #body>
      <!-- Preview Area -->
      <div class="w-full bg-neutral-950 dark:bg-black rounded-xl overflow-hidden min-h-80 flex items-center justify-center relative border border-accented/40 shadow-inner">
        <!-- Image -->
        <NuxtImg
          v-if="isImage(item?.extension) && item?.path"
          :src="fileUrl"
          :alt="item?.name"
          class="max-h-[60vh] object-contain w-full select-none"
        />

        <!-- Video -->
        <video
          v-else-if="isVideo(item?.extension) && item?.path"
          :src="fileUrl"
          controls
          class="max-h-[60vh] w-full"
          autoplay
        />

        <!-- Audio -->
        <div v-else-if="isAudio(item?.extension) && item?.path" class="w-full p-8 flex flex-col items-center gap-4 text-white">
          <div class="p-6 bg-white/10 rounded-full text-primary-400 animate-pulse">
            <UIcon name="i-lucide-music" class="w-16 h-16 text-indigo-400" />
          </div>
          <p class="text-sm font-semibold truncate max-w-md text-neutral-200">
            {{ item?.name }}
          </p>
          <audio :src="fileUrl" controls class="w-full max-w-md mt-2" />
        </div>

        <!-- PDF -->
        <iframe
          v-else-if="isPdf(item?.extension) && item?.path"
          :src="fileUrl"
          class="w-full h-[60vh]"
          frameborder="0"
        />

        <!-- Generic File / No preview -->
        <div v-else class="text-center p-12 text-white">
          <div class="p-5 bg-white/10 rounded-3xl inline-flex items-center justify-center mb-4">
            <UIcon name="i-lucide-file-text" class="w-16 h-16 text-neutral-400" />
          </div>
          <h4 class="text-lg font-semibold">
            {{ item?.name }}
          </h4>
          <p class="text-sm text-neutral-400 mt-1">
            Preview tidak didukung untuk tipe file ini.
          </p>
          <UButton
            as="a"
            :href="fileUrl"
            target="_blank"
            download
            icon="i-lucide-download"
            class="mt-6 text-white bg-primary-600 hover:bg-primary-700"
          >
            Download File
          </UButton>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex gap-2.5 w-full justify-end">
        <UButton
          color="neutral"
          variant="outline"
          icon="i-lucide-copy"
          class="cursor-pointer"
          @click="handleCopyLink"
        >
          {{ copied ? 'Tersalin!' : 'Salin Link File' }}
        </UButton>
        <UButton
          as="a"
          :href="fileUrl"
          target="_blank"
          download
          icon="i-lucide-download"
          class="text-white cursor-pointer"
        >
          Download File
        </UButton>
      </div>
    </template>
  </UModal>
</template>
