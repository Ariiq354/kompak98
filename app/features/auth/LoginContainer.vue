<script setup></script>

<template>
  <div class="min-h-screen w-full flex">
    <!-- Left Side -->
    <div class="hidden lg:flex w-1/2 relative">
      <NuxtImg
        src="/images/auth-image.svg"
        alt="Auth Banner"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-black/40" />

      <NuxtImg
        src="/images/logo-vertical.webp"
        class="relative z-10 m-auto"
        alt="Logo"
      />
    </div>

    <!-- Right Side -->
    <div class="w-full lg:w-1/2 flex items-center justify-center bg-blue-50 px-6 py-12">
      <UCard class="w-full max-w-md" title="Selamat Datang" description="Masukkan nip dan password Anda untuk mengakses akun Anda.">
        <div class="space-y-6">
          <div class="flex flex-col items-center text-center">
            <NuxtImg src="/ppg.webp" width="200" height="200" alt="logo ppg" />
            <div class="text-highlighted text-2xl font-bold">
              Assalamualaikum
            </div>
            <div class="text-muted mt-1">
              Silahkan login dengan akun anda
            </div>
          </div>
          <UForm
            class="w-full space-y-6"
          >
            <UFormField label="NIP 9" name="username">
              <UInput
                placeholder="Masukkan username anda"
              />
            </UFormField>

            <UFormField label="Password" name="password">
              <InputPassword
                placeholder="Masukkan password anda"
              />
            </UFormField>

            <UCheckbox
              label="Ingat saya"
            />

            <UButton
              class="flex w-full justify-center"
              type="submit"
            >
              Masuk
            </UButton>
          </UForm>

          <div class="font-bold text-muted text-sm text-center">
            Untuk pendaftaran akun, hubungi <a
              class="text-primary-500" href="https://wa.me/6289605834601"
              target="_blank"
            >Admin</a>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>
