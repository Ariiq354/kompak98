<script setup lang="ts">
import { useClipboard } from "@vueuse/core";
import { useAuthSession } from "~/composables/auth";
import CreateFolderModal from "./components/CreateFolderModal.vue";
import PreviewModal from "./components/PreviewModal.vue";
import RenameModal from "./components/RenameModal.vue";
import UploadModal from "./components/UploadModal.vue";

const config = useRuntimeConfig();
const route = useRoute();
const router = useRouter();
const { session } = await useAuthSession();
const { copy } = useClipboard({ legacy: true });

const isAdmin = computed(() => session.value?.user.role === "admin");

// Dynamic state from URL query parameters
const parentId = computed(() => {
  const val = route.query.parentId;
  return val ? Number(val) : null;
});

const search = ref("");
const debouncedSearch = ref("");
let searchTimeout: NodeJS.Timeout | null = null;

// View Mode and Type Filtering
const viewMode = ref<"grid" | "list">("grid");
const filterType = ref<"all" | "image" | "video" | "document" | "archive">("all");

// Debounce search input to avoid spamming the backend API
watch(search, (newVal) => {
  if (searchTimeout)
    clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    debouncedSearch.value = newVal;
  }, 300);
});

// Fetch contents of current folder
const { data: items, status: itemsStatus, refresh } = await useFetch("/api/v1/galeri", {
  query: computed(() => ({
    parentId: parentId.value,
    search: debouncedSearch.value || undefined,
  })),
  watch: [parentId, debouncedSearch],
});

// Fetch folder details for current folder (for breadcrumbs)
const { data: folderDetails } = await useAsyncData(
  "folder-details",
  async () => {
    if (!parentId.value)
      return null;
    return await $fetch<{
      item: any;
      breadcrumbs: { id: number | null; name: string }[];
    }>(`/api/v1/galeri/${parentId.value}`);
  },
  {
    watch: [parentId],
  },
);

// Breadcrumbs formatting
const breadcrumbs = computed(() => {
  const crumbs: { id: number | null; name: string; icon?: string }[] = [
    { id: null, name: "Galeri Utama", icon: "i-lucide-home" },
  ];
  if (folderDetails.value?.breadcrumbs) {
    crumbs.push(...folderDetails.value.breadcrumbs);
  }
  return crumbs;
});

// Modals control
const folderModalOpen = ref(false);
const uploadModalOpen = ref(false);
const renameModalOpen = ref(false);
const deleteModalOpen = ref(false);
const previewModalOpen = ref(false);

const activeItem = ref<any>(null);
const isDeleting = ref(false);

function navigateTo(id: number | null) {
  search.value = ""; // Clear search when navigating folders
  filterType.value = "all"; // Reset filter
  router.push({
    query: {
      parentId: id || undefined,
    },
  });
}

function openRename(item: any) {
  activeItem.value = item;
  renameModalOpen.value = true;
}

function openDelete(item: any) {
  activeItem.value = item;
  deleteModalOpen.value = true;
}

function openPreview(file: any) {
  activeItem.value = file;
  previewModalOpen.value = true;
}

function copyDirectLink(file: any) {
  if (!file?.path)
    return;
  const url = `${config.public.imageUrl}/${file.path}`;
  copy(url);
  useToastSuccess("Salin Link", "Link file berhasil disalin");
}

async function confirmDelete() {
  if (!activeItem.value)
    return;
  isDeleting.value = true;
  try {
    await $fetch(`/api/v1/galeri/${activeItem.value.id}`, {
      method: "DELETE",
    });
    useToastSuccess("Sukses", "Item berhasil dihapus");
    deleteModalOpen.value = false;
    refresh();
  }
  catch (error: any) {
    useToastError("Gagal Menghapus", error.data?.message || "Internal Server Error");
  }
  finally {
    isDeleting.value = false;
  }
}

// Local filtering and categorization helpers
const filteredFolders = computed(() => {
  if (filterType.value !== "all")
    return [];
  return items.value?.filter((i: any) => i.isFolder) || [];
});

const filteredFiles = computed(() => {
  let list = items.value?.filter((i: any) => !i.isFolder) || [];
  if (filterType.value === "image") {
    list = list.filter((f: any) => isImage(f.extension));
  }
  else if (filterType.value === "video") {
    list = list.filter((f: any) => isVideo(f.extension));
  }
  else if (filterType.value === "document") {
    list = list.filter((f: any) => isDocument(f.extension));
  }
  else if (filterType.value === "archive") {
    list = list.filter((f: any) => isArchive(f.extension));
  }
  return list;
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

function isDocument(ext: string | null | undefined) {
  if (!ext)
    return false;
  return ["pdf", "doc", "docx", "txt", "rtf", "xls", "xlsx", "csv", "ppt", "pptx", "ods", "odt", "odp"].includes(ext.toLowerCase());
}

function isArchive(ext: string | null | undefined) {
  if (!ext)
    return false;
  return ["zip", "rar", "7z", "tar", "gz"].includes(ext.toLowerCase());
}

function getFileIcon(ext: string | null | undefined) {
  if (!ext)
    return { icon: "i-lucide-file", color: "text-neutral-400 bg-neutral-100 dark:bg-neutral-800" };
  const e = ext.toLowerCase();
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(e)) {
    return { icon: "i-lucide-file-image", color: "text-blue-500 bg-blue-50 dark:bg-blue-950/20" };
  }
  if (["mp4", "webm", "ogg", "avi", "mov"].includes(e)) {
    return { icon: "i-lucide-file-video", color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20" };
  }
  if (["mp3", "wav", "aac", "flac"].includes(e)) {
    return { icon: "i-lucide-file-audio", color: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20" };
  }
  if (["pdf"].includes(e)) {
    return { icon: "i-lucide-file-text", color: "text-red-500 bg-red-50 dark:bg-red-950/20" };
  }
  if (["doc", "docx", "txt", "rtf", "odt"].includes(e)) {
    return { icon: "i-lucide-file-text", color: "text-sky-500 bg-sky-50 dark:bg-sky-950/20" };
  }
  if (["xls", "xlsx", "csv", "ods"].includes(e)) {
    return { icon: "i-lucide-file-spreadsheet", color: "text-green-500 bg-green-50 dark:bg-green-950/20" };
  }
  if (["ppt", "pptx", "odp"].includes(e)) {
    return { icon: "i-lucide-presentation", color: "text-orange-500 bg-orange-50 dark:bg-orange-950/20" };
  }
  if (["zip", "rar", "7z", "tar", "gz"].includes(e)) {
    return { icon: "i-lucide-folder-archive", color: "text-amber-500 bg-amber-50 dark:bg-amber-950/20" };
  }
  return { icon: "i-lucide-file", color: "text-neutral-400 bg-neutral-50 dark:bg-neutral-900" };
}

function formatBytes(bytes: number | null | undefined, decimals = 2) {
  if (bytes === undefined || bytes === null)
    return "-";
  if (bytes === 0)
    return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
}

function formatDate(dateStr: string | Date | null | undefined) {
  if (!dateStr)
    return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
</script>

<template>
  <div class="space-y-6">
    <!-- Action Modals -->
    <CreateFolderModal
      v-model:open="folderModalOpen"
      :parent-id="parentId"
      @submit="refresh"
    />

    <UploadModal
      v-model:open="uploadModalOpen"
      :parent-id="parentId"
      @submit="refresh"
    />

    <RenameModal
      v-model:open="renameModalOpen"
      :item="activeItem"
      @submit="refresh"
    />

    <PreviewModal
      v-model:open="previewModalOpen"
      :item="activeItem"
    />

    <!-- Delete Confirmation Modal -->
    <UModal
      v-model:open="deleteModalOpen"
      title="Konfirmasi Hapus"
      class="max-w-md"
    >
      <template #body>
        <div class="flex items-center gap-4">
          <div class="p-3 bg-red-50 dark:bg-red-950/30 text-red-500 rounded-full shrink-0">
            <UIcon name="i-lucide-triangle-alert" class="w-6 h-6" />
          </div>
          <div>
            <p class="text-sm font-semibold text-default">
              Apakah Anda yakin ingin menghapus item ini?
            </p>
            <p class="text-xs text-dimmed mt-1">
              Menghapus folder akan menghapus semua file dan sub-folder di dalamnya secara permanen.
            </p>
            <p v-if="activeItem" class="text-xs font-semibold text-red-500 mt-2 truncate max-w-sm">
              Nama: {{ activeItem.name }}
            </p>
          </div>
        </div>
      </template>
      <template #footer>
        <UButton
          variant="ghost"
          :disabled="isDeleting"
          class="cursor-pointer"
          @click="() => { deleteModalOpen = false }"
        >
          Batal
        </UButton>
        <UButton
          color="error"
          :loading="isDeleting"
          class="text-white cursor-pointer"
          @click="confirmDelete"
        >
          Hapus
        </UButton>
      </template>
    </UModal>

    <!-- Toolbar and Navigation Header -->
    <div class="flex flex-col gap-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <!-- Breadcrumbs -->
        <nav class="flex items-center gap-1.5 overflow-x-auto min-w-0 py-1" aria-label="Breadcrumb">
          <div
            v-for="(crumb, idx) in breadcrumbs"
            :key="crumb.id ?? 'root'"
            class="flex items-center gap-1.5 shrink-0 text-sm"
          >
            <UIcon v-if="idx > 0" name="i-lucide-chevron-right" class="text-dimmed w-4 h-4" />

            <button
              class="flex items-center gap-1 font-semibold px-3 py-1.5 rounded-xl hover:bg-elevated/60 text-dimmed hover:text-default transition-all border border-transparent hover:border-accented/30 cursor-pointer"
              :class="{ 'text-primary! bg-primary/5 border-primary/20 font-bold': idx === breadcrumbs.length - 1 }"
              @click="navigateTo(crumb.id)"
            >
              <UIcon v-if="crumb.icon" :name="crumb.icon" class="w-4 h-4" />
              <span>{{ crumb.name }}</span>
            </button>
          </div>
        </nav>

        <!-- Admin Actions (Create Folder & Upload File) -->
        <div v-if="isAdmin" class="flex items-center gap-2.5">
          <UButton
            icon="i-lucide-folder-plus"
            variant="subtle"
            class="cursor-pointer font-semibold"
            @click="() => { folderModalOpen = true }"
          >
            Buat Folder
          </UButton>
          <UButton
            icon="i-lucide-upload"
            class="text-white bg-primary hover:bg-primary/95 shadow-sm cursor-pointer font-semibold"
            @click="() => { uploadModalOpen = true }"
          >
            Upload File
          </UButton>
        </div>
      </div>

      <!-- Filters & View Options Row -->
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
              @click="() => refresh()"
            />
          </div>
        </div>
      </UCard>
    </div>

    <!-- Empty State -->
    <div
      v-if="itemsStatus !== 'pending' && filteredFolders.length === 0 && filteredFiles.length === 0"
      class="flex flex-col items-center justify-center p-12 bg-elevated/10 border border-dashed border-accented rounded-2xl text-center min-h-75"
    >
      <div class="p-4 bg-primary/5 rounded-full aspect-square text-primary mb-4 animate-bounce">
        <UIcon name="i-lucide-folder-open" class="w-12 h-12" />
      </div>
      <h3 class="text-lg font-bold text-default">
        {{ search || filterType !== 'all' ? 'Pencarian tidak ditemukan' : 'Folder ini Kosong' }}
      </h3>
      <p class="text-sm text-dimmed max-w-sm mt-1">
        {{ search || filterType !== 'all' ? 'Coba ganti kata kunci pencarian atau ganti tipe filter Anda.' : 'Belum ada folder atau file yang di-upload di direktori ini.' }}
      </p>
      <div v-if="isAdmin && !search && filterType === 'all'" class="mt-4 flex gap-2">
        <UButton
          size="sm"
          variant="subtle"
          icon="i-lucide-folder-plus"
          class="cursor-pointer"
          @click="() => { folderModalOpen = true }"
        >
          Buat Folder
        </UButton>
        <UButton
          size="sm"
          icon="i-lucide-upload"
          class="text-white cursor-pointer"
          @click="() => { uploadModalOpen = true }"
        >
          Upload File
        </UButton>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else-if="itemsStatus === 'pending'" class="space-y-6">
      <div v-if="viewMode === 'grid'" class="space-y-6">
        <div class="space-y-2">
          <USkeleton class="h-5 w-24" />
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <USkeleton v-for="n in 4" :key="n" class="h-16 rounded-xl" />
          </div>
        </div>
        <div class="space-y-2">
          <USkeleton class="h-5 w-20" />
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <USkeleton v-for="n in 4" :key="n" class="h-48 rounded-xl" />
          </div>
        </div>
      </div>
      <div v-else class="space-y-4">
        <USkeleton class="h-10 w-full rounded-xl" />
        <USkeleton v-for="n in 5" :key="n" class="h-14 w-full rounded-xl" />
      </div>
    </div>

    <!-- Gallery Directory Views -->
    <div v-else class="space-y-6">
      <!-- Grid View -->
      <div v-if="viewMode === 'grid'" class="space-y-6">
        <!-- Folders Section -->
        <div v-if="filteredFolders.length > 0" class="space-y-3">
          <h3 class="text-xs font-bold text-dimmed uppercase tracking-wider px-1">
            Folder ({{ filteredFolders.length }})
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div
              v-for="folder in filteredFolders"
              :key="folder.id"
              class="group flex items-center justify-between p-3.5 bg-white border border-accented/80 hover:border-primary/30 rounded-xl cursor-pointer hover:shadow-sm transition-all duration-200"
              @click="navigateTo(folder.id)"
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
                  @click="openRename(folder)"
                />
                <UButton
                  icon="i-lucide-trash"
                  variant="ghost"
                  color="error"
                  size="sm"
                  class="cursor-pointer"
                  @click="openDelete(folder)"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Files Section -->
        <div v-if="filteredFiles.length > 0" class="space-y-3">
          <h3 class="text-xs font-bold text-dimmed uppercase tracking-wider px-1">
            File ({{ filteredFiles.length }})
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div
              v-for="file in filteredFiles"
              :key="file.id"
              class="group flex flex-col bg-white border border-accented/80 hover:border-primary/30 rounded-2xl overflow-hidden hover:shadow-md transition-all duration-200"
            >
              <!-- Thumbnail / File Type Display -->
              <div
                class="aspect-video w-full bg-elevated/40 relative flex items-center justify-center overflow-hidden border-b border-accented/50 cursor-pointer"
                @click="openPreview(file)"
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

                <!-- Quick Hover Controls (Download, Copy Link, Preview) -->
                <div
                  class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2.5 transition-opacity duration-200"
                  @click.stop
                >
                  <UButton
                    icon="i-lucide-eye"
                    class="rounded-full h-10 w-10 flex items-center justify-center bg-white text-black hover:bg-neutral-100 cursor-pointer shadow-sm"
                    size="sm"
                    title="Preview File"
                    @click="openPreview(file)"
                  />
                  <UButton
                    icon="i-lucide-copy"
                    class="rounded-full h-10 w-10 flex items-center justify-center bg-white text-black hover:bg-neutral-100 cursor-pointer shadow-sm"
                    size="sm"
                    title="Salin Link"
                    @click="copyDirectLink(file)"
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
                  />
                </div>

                <!-- Extension Badge -->
                <span class="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-neutral-900/80 backdrop-blur-md text-white border border-white/10 uppercase tracking-wider">
                  {{ file.extension || 'FILE' }}
                </span>
              </div>

              <!-- Details -->
              <div class="p-3.5 flex flex-col justify-between flex-1 gap-2">
                <div class="min-w-0 cursor-pointer" @click="openPreview(file)">
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

                <!-- Extra actions footer -->
                <div class="flex items-center justify-between mt-1 pt-2 border-t border-accented/40">
                  <button
                    class="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                    @click="openPreview(file)"
                  >
                    <UIcon name="i-lucide-eye" class="w-3.5 h-3.5" />
                    Preview
                  </button>

                  <div v-if="isAdmin" class="flex items-center gap-0.5">
                    <UButton
                      icon="i-lucide-pencil"
                      variant="ghost"
                      color="neutral"
                      size="sm"
                      class="cursor-pointer"
                      @click="openRename(file)"
                    />
                    <UButton
                      icon="i-lucide-trash"
                      variant="ghost"
                      color="error"
                      size="sm"
                      class="cursor-pointer"
                      @click="openDelete(file)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- List View -->
      <div v-else class="border border-accented rounded-2xl overflow-hidden bg-elevated/10">
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
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-accented/60 text-sm">
              <!-- Folders in List View -->
              <tr
                v-for="folder in filteredFolders"
                :key="folder.id"
                class="hover:bg-elevated/35 hover:dark:bg-elevated/10 transition-colors cursor-pointer group"
                @click="navigateTo(folder.id)"
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
                <td class="py-3 px-4 text-center" @click.stop>
                  <div v-if="isAdmin" class="inline-flex items-center gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity">
                    <UButton
                      icon="i-lucide-pencil"
                      variant="ghost"
                      color="neutral"
                      size="sm"
                      class="cursor-pointer"
                      @click="openRename(folder)"
                    />
                    <UButton
                      icon="i-lucide-trash"
                      variant="ghost"
                      color="error"
                      size="sm"
                      class="cursor-pointer"
                      @click="openDelete(folder)"
                    />
                  </div>
                </td>
              </tr>

              <!-- Files in List View -->
              <tr
                v-for="file in filteredFiles"
                :key="file.id"
                class="hover:bg-elevated/35 hover:dark:bg-elevated/10 transition-colors cursor-pointer group"
                @click="openPreview(file)"
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
                <td class="py-3 px-4 text-center" @click.stop>
                  <div class="inline-flex items-center gap-1">
                    <UButton
                      icon="i-lucide-copy"
                      variant="ghost"
                      color="neutral"
                      size="sm"
                      class="cursor-pointer md:opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Salin Link"
                      @click="copyDirectLink(file)"
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
                    <div v-if="isAdmin" class="inline-flex items-center gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity">
                      <UButton
                        icon="i-lucide-pencil"
                        variant="ghost"
                        color="neutral"
                        size="sm"
                        class="cursor-pointer"
                        @click="openRename(file)"
                      />
                      <UButton
                        icon="i-lucide-trash"
                        variant="ghost"
                        color="error"
                        size="sm"
                        class="cursor-pointer"
                        @click="openDelete(file)"
                      />
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
