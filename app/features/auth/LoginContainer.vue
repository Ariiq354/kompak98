<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import type { LoginSchema } from "./constants";
import { initFormDataLogin, loginSchema } from "./constants";

const state = ref(initFormDataLogin);

const isLoading = ref(false);
const route = useRoute();
async function onSubmit(event: FormSubmitEvent<LoginSchema>) {
  const redirect = typeof route.query.redirect === "string"
    ? route.query.redirect
    : "/dashboard";

  await authClient.signIn.username({
    username: event.data.nip,
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
      useToastError("Gagal login", "Username atau password salah, silahkan coba lagi.");
    },
  });
}
</script>

<template>
  <div class="w-full lg:w-1/2 flex flex-col items-center justify-center bg-blue-50 px-6 py-12">
    <NuxtImg
      src="/images/logo-horizontal.webp"
      class="lg:hidden flex mb-8 h-10"
      alt="Logo"
    />
    <UCard class="w-full max-w-lg md:p-8 p-4 rounded-4xl">
      <div class="space-y-6">
        <div class="mb-8">
          <h2 class="lg:text-3xl text-xl font-bold text-gray-900">
            Selamat Datang!
          </h2>
          <p class="mt-2 text-gray-500 lg:text-base text-sm">
            Silahkan login dengan akun anda
          </p>
        </div>
        <UForm
          :schema="loginSchema"
          :state="state"
          class="w-full space-y-6"
          @submit="onSubmit"
        >
          <UFormField label="NIP 9" name="nip">
            <UInput
              v-model="state.nip"
              :disabled="isLoading"
              placeholder="Masukkan nip anda"
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
            :disabled="isLoading"
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

        <div class="font-bold text-muted text-sm text-center">
          Belum punya akun? Silahkan
          <NuxtLink
            class="text-primary-500" to="/register"
          >
            daftar
          </nuxtlink>
        </div>
      </div>
    </UCard>
  </div>
</template>
