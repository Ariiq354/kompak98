<script setup lang="ts">
import { FetchError } from "ofetch";
import z from "zod";
import { useToastError, useToastSuccess } from "~/composables/toast";

const props = defineProps<{
  parentId: number | null;
}>();

const emit = defineEmits(["submit"]);

const open = defineModel<boolean>("open", {
  required: true,
});

const schema = z.object({
  name: z.string().min(1, "Nama folder tidak boleh kosong"),
});

const state = ref({
  name: "",
});

const isLoading = ref(false);

async function onSubmit() {
  isLoading.value = true;
  try {
    await $fetch("/api/v1/galeri/folder", {
      method: "POST",
      body: {
        name: state.value.name,
        parentId: props.parentId,
      },
    });

    useToastSuccess("Sukses", "Folder berhasil dibuat");
    open.value = false;
    state.value.name = "";
    emit("submit");
  }
  catch (error) {
    if (error instanceof FetchError) {
      useToastError("Gagal Membuat Folder", error.data.message);
    }
    else {
      useToastError("Gagal Membuat Folder", "Internal Server Error");
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
    title="Buat Folder Baru"
    class="max-w-md"
  >
    <template #body>
      <UForm
        id="folder-form"
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField label="Nama Folder" name="name">
          <UInput
            v-model="state.name"
            placeholder="Masukkan nama folder..."
            icon="i-lucide-folder-open"
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
        form="folder-form"
      >
        Buat
      </UButton>
    </template>
  </UModal>
</template>
