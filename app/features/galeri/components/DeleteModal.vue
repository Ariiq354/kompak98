<script setup lang="ts">
import { ref } from "vue";
import { useToastError, useToastSuccess } from "~/composables/toast";

const props = defineProps<{
  item: any;
}>();

const emit = defineEmits(["submit"]);

const open = defineModel<boolean>("open", {
  required: true,
});

const isDeleting = ref(false);

async function confirmDelete() {
  if (!props.item)
    return;
  isDeleting.value = true;
  try {
    await $fetch(`/api/v1/galeri/${props.item.id}`, {
      method: "DELETE",
    });
    useToastSuccess("Sukses", "Item berhasil dihapus");
    open.value = false;
    emit("submit");
  }
  catch (error: any) {
    useToastError("Gagal Menghapus", error.data?.message || "Internal Server Error");
  }
  finally {
    isDeleting.value = false;
  }
}
</script>

<template>
  <UModal
    v-model:open="open"
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
          <p v-if="item" class="text-xs font-semibold text-red-500 mt-2 truncate max-w-sm">
            Nama: {{ item.name }}
          </p>
        </div>
      </div>
    </template>
    <template #footer>
      <UButton
        variant="ghost"
        :disabled="isDeleting"
        class="cursor-pointer"
        @click="() => { open = false }"
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
</template>
