<script setup lang="ts">
import { useClipboard } from "@vueuse/core";
import { useAuthSession } from "~/composables/auth";
import { useToastSuccess } from "~/composables/toast";
import CreateFolderModal from "./components/CreateFolderModal.vue";
import DeleteModal from "./components/DeleteModal.vue";
import GaleriEmptyState from "./components/GaleriEmptyState.vue";
import GaleriGridView from "./components/GaleriGridView.vue";
import GaleriHeader from "./components/GaleriHeader.vue";
import GaleriListView from "./components/GaleriListView.vue";
import GaleriToolbar from "./components/GaleriToolbar.vue";
import PreviewModal from "./components/PreviewModal.vue";
import RenameModal from "./components/RenameModal.vue";
import UploadModal from "./components/UploadModal.vue";
import { isArchive, isDocument, isImage, isVideo } from "./utils/helpers";

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

    <DeleteModal
      v-model:open="deleteModalOpen"
      :item="activeItem"
      @submit="refresh"
    />

    <!-- Toolbar and Navigation Header -->
    <div class="flex flex-col gap-4">
      <GaleriHeader
        :breadcrumbs="breadcrumbs"
        :is-admin="isAdmin"
        @navigate="navigateTo"
        @create-folder="() => { folderModalOpen = true }"
        @upload-file="() => { uploadModalOpen = true }"
      />

      <GaleriToolbar
        v-model:search="search"
        v-model:filter-type="filterType"
        v-model:view-mode="viewMode"
        @refresh="refresh"
      />
    </div>

    <!-- Empty State -->
    <GaleriEmptyState
      v-if="itemsStatus !== 'pending' && filteredFolders.length === 0 && filteredFiles.length === 0"
      :search="search"
      :filter-type="filterType"
      :is-admin="isAdmin"
      @create-folder="() => { folderModalOpen = true }"
      @upload-file="() => { uploadModalOpen = true }"
    />

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
    <div v-else>
      <GaleriGridView
        v-if="viewMode === 'grid'"
        :folders="filteredFolders"
        :files="filteredFiles"
        :is-admin="isAdmin"
        @navigate="navigateTo"
        @preview="openPreview"
        @copy-link="copyDirectLink"
        @rename="openRename"
        @delete="openDelete"
      />

      <GaleriListView
        v-else
        :folders="filteredFolders"
        :files="filteredFiles"
        :is-admin="isAdmin"
        @navigate="navigateTo"
        @preview="openPreview"
        @copy-link="copyDirectLink"
        @rename="openRename"
        @delete="openDelete"
      />
    </div>
  </div>
</template>
