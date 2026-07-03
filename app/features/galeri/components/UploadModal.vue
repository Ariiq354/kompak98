<script setup lang="ts">
import { FetchError } from "ofetch";

const props = defineProps<{
  parentId: number | null;
}>();

const emit = defineEmits(["submit"]);

const open = defineModel<boolean>("open", {
  required: true,
});

const files = ref<FileList | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const isLoading = ref(false);
const isDragging = ref(false);
const imagePreviews = ref<Record<string, string>>({});

const selectedFiles = computed(() => {
  if (!files.value)
    return [];
  return Array.from(files.value);
});

// Watch for file list changes to generate object URLs for image thumbnails
watch(files, (newFiles) => {
  // Revoke old URLs to prevent memory leaks
  Object.values(imagePreviews.value).forEach(url => URL.revokeObjectURL(url));
  imagePreviews.value = {};

  if (!newFiles)
    return;

  Array.from(newFiles).forEach((file) => {
    if (file.type.startsWith("image/")) {
      imagePreviews.value[file.name] = URL.createObjectURL(file);
    }
  });
});

onBeforeUnmount(() => {
  Object.values(imagePreviews.value).forEach(url => URL.revokeObjectURL(url));
});

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    files.value = target.files;
  }
}

function triggerFileInput() {
  fileInput.value?.click();
}

function handleDrop(event: DragEvent) {
  isDragging.value = false;
  const droppedFiles = event.dataTransfer?.files;
  if (droppedFiles && droppedFiles.length > 0) {
    files.value = droppedFiles;
  }
}

function removeFile(index: number) {
  if (!files.value)
    return;
  const dt = new DataTransfer();
  for (let i = 0; i < files.value.length; i++) {
    if (i !== index) {
      const file = files.value[i];
      if (file) {
        dt.items.add(file);
      }
    }
  }
  files.value = dt.files;
}

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0)
    return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
}

async function onSubmit() {
  if (selectedFiles.value.length === 0) {
    useToastError("Peringatan", "Pilih setidaknya satu file untuk di-upload.");
    return;
  }

  isLoading.value = true;
  try {
    const formData = new FormData();
    if (props.parentId) {
      formData.append("parentId", String(props.parentId));
    }

    selectedFiles.value.forEach((file) => {
      formData.append("file", file);
    });

    await $fetch("/api/v1/galeri/upload", {
      method: "POST",
      body: formData,
    });

    useToastSuccess("Sukses", "File berhasil di-upload");
    open.value = false;
    files.value = null;
    emit("submit");
  }
  catch (error) {
    if (error instanceof FetchError) {
      useToastError("Gagal Upload File", error.data.message);
    }
    else {
      useToastError("Gagal Upload File", "Internal Server Error");
    }
  }
  finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <UModal
    v-model:open="open"
    title="Upload File"
    class="max-w-lg"
  >
    <template #body>
      <div class="space-y-5">
        <!-- Hidden File Input -->
        <input
          ref="fileInput"
          type="file"
          multiple
          class="hidden"
          @change="handleFileChange"
        >

        <!-- Drag & Drop / Click Zone -->
        <div
          class="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 group relative overflow-hidden"
          :class="[
            isDragging
              ? 'border-primary bg-primary/10 scale-[0.99] shadow-inner'
              : 'border-accented hover:border-primary/40 hover:bg-elevated/40',
          ]"
          @click="triggerFileInput"
          @dragover.prevent="isDragging = true"
          @dragenter.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="handleDrop"
        >
          <div class="p-4 bg-primary/5 rounded-full text-primary aspect-square flex items-center justify-center group-hover:scale-110 transition-transform duration-250 mb-3">
            <UIcon name="i-lucide-upload-cloud" class="w-8 h-8" />
          </div>
          <p class="text-sm font-semibold text-default text-center">
            Tarik & taruh file di sini, atau klik untuk memilih
          </p>
          <p class="text-xs text-dimmed mt-1.5 text-center">
            Mendukung gambar, video, dokumen, dsb. hingga 50MB
          </p>
        </div>

        <!-- Selected Files List -->
        <div v-if="selectedFiles.length > 0" class="max-h-64 overflow-y-auto space-y-2 border border-accented rounded-xl p-3 bg-elevated/10">
          <p class="text-xs font-bold text-dimmed uppercase tracking-wider mb-2.5 px-1">
            File Terpilih ({{ selectedFiles.length }})
          </p>
          <div
            v-for="(file, index) in selectedFiles"
            :key="file.name + index"
            class="flex items-center justify-between p-2 rounded-lg bg-elevated/40 hover:bg-elevated border border-accented/40 transition-colors"
          >
            <div class="flex items-center gap-3 min-w-0 pr-4">
              <!-- Thumbnail for images, fallback icon for others -->
              <img
                v-if="imagePreviews[file.name]"
                :src="imagePreviews[file.name]"
                class="w-10 h-10 rounded-md object-cover shrink-0 border border-accented"
                alt="preview"
              >
              <div
                v-else
                class="w-10 h-10 rounded-md bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 shrink-0 border border-accented"
              >
                <UIcon name="i-lucide-file" class="w-5 h-5" />
              </div>

              <div class="min-w-0">
                <p class="text-sm font-semibold truncate text-default" :title="file.name">
                  {{ file.name }}
                </p>
                <p class="text-xs text-dimmed mt-0.5">
                  {{ formatBytes(file.size) }}
                </p>
              </div>
            </div>
            <UButton
              icon="i-lucide-trash"
              color="error"
              variant="ghost"
              size="sm"
              class="cursor-pointer"
              :disabled="isLoading"
              @click.stop="removeFile(index)"
            />
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <UButton
        icon="i-lucide-x"
        variant="ghost"
        :disabled="isLoading"
        class="cursor-pointer"
        @click="() => { open = false }"
      >
        Batal
      </UButton>
      <UButton
        icon="i-lucide-check"
        :loading="isLoading"
        :disabled="selectedFiles.length === 0"
        class="text-white cursor-pointer"
        @click="onSubmit"
      >
        Upload
      </UButton>
    </template>
  </UModal>
</template>
