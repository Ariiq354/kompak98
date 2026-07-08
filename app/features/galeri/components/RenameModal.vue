<script setup lang="ts">
import { FetchError } from "ofetch";
import z from "zod";
import { useToastError, useToastSuccess } from "~/composables/toast";

const props = defineProps<{
  item: { id: number; name: string; isFolder: boolean } | null;
}>();

const emit = defineEmits(["submit"]);

const open = defineModel<boolean>("open", {
  required: true,
});

const schema = z.object({
  name: z.string().min(1, "Nama tidak boleh kosong"),
});

const state = ref({
  name: "",
});

// Watch for item changes to prefill name
watch(
  () => props.item,
  (newItem) => {
    if (newItem) {
      state.value.name = newItem.name;
    }
  },
  { immediate: true },
);

const isLoading = ref(false);

async function onSubmit() {
  if (!props.item)
    return;

  isLoading.value = true;
  try {
    await $fetch(`/api/v1/galeri/${props.item.id}`, {
      method: "PATCH",
      body: {
        name: state.value.name,
      },
    });

    useToastSuccess("Sukses", "Nama berhasil diubah");
    open.value = false;
    emit("submit");
  }
  catch (error) {
    if (error instanceof FetchError) {
      useToastError("Gagal Mengubah Nama", error.data.message);
    }
    else {
      useToastError("Gagal Mengubah Nama", "Internal Server Error");
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
    :title="item?.isFolder ? 'Ubah Nama Folder' : 'Ubah Nama File'"
    class="max-w-md"
  >
    <template #body>
      <UForm
        id="rename-form"
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField :label="item?.isFolder ? 'Nama Folder' : 'Nama File'" name="name">
          <UInput
            v-model="state.name"
            placeholder="Masukkan nama baru..."
            icon="i-lucide-pencil"
            :disabled="isLoading"
            class="w-full"
            autofocus
          />
        </UFormField>
      </UForm>
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
        type="submit"
        icon="i-lucide-check"
        :loading="isLoading"
        class="text-white cursor-pointer"
        form="rename-form"
      >
        Simpan
      </UButton>
    </template>
  </UModal>
</template>
