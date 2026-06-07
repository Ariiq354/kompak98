<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import type { LoginSchema } from "./constants";
import { initFormDataLogin, loginSchema } from "./constants";

const state = reactive(initFormDataLogin);
const isLoading = ref(false);

const route = useRoute();
async function onSubmit(event: FormSubmitEvent<LoginSchema>) {
  const redirect = typeof route.query.redirect === "string"
    ? route.query.redirect
    : "/dashboard";

  authClient.signIn.email({
    email: event.data.email,
    password: event.data.password,
    rememberMe: event.data.rememberMe,
  }, {
    onRequest: () => {
      isLoading.value = true;
    },
    onSuccess: async () => {
      isLoading.value = false;
      await navigateTo(redirect, { external: true });
    },
    onError: () => {
      isLoading.value = false;
      useToastError("Error", "Gagal keluar. Silahkan coba lagi.");
    },
  });
}
</script>

<template>
  <UCard class="w-full max-w-md">
    <div class="space-y-6">
      <div class="flex flex-col items-center text-center">
        <NuxtImg src="/images/logo-kemenag-bogor.png" alt="logo GEMA" class="w-50" />
        <div class="text-highlighted text-2xl font-bold mt-6">
          Assalamualaikum
        </div>
        <div class="text-muted mt-1">
          Silahkan login dengan akun anda
        </div>
      </div>
      <UForm
        :schema="loginSchema"
        :state="state"
        class="w-full space-y-6"
        @submit="onSubmit"
      >
        <UFormField label="Email" name="email">
          <UInput
            v-model="state.email"
            :disabled="isLoading"
            placeholder="Masukkan email anda"
          />
        </UFormField>

        <UFormField label="Password" name="password">
          <InputPassword
            v-model="state.password"
            :disabled="isLoading"
            placeholder="Masukkan password anda"
          />
        </UFormField>

        <UCheckbox
          v-model="state.rememberMe"
          label="Ingat saya"
        />

        <UButton
          class="flex w-full justify-center"
          type="submit"
          :loading="isLoading"
        >
          Masuk
        </UButton>
      </UForm>
    </div>
  </UCard>
</template>
