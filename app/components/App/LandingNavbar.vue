<template>
  <header class="py-4 px-4 md:px-0">
    <div class="md:container mx-auto">
      <div class="flex items-center justify-between">
        <NuxtImg
          src="/images/logo-horizontal.webp"
          alt="logo"
          height="40"
          class="md:h-12.5 h-9 w-auto"
        />

        <UButton
          to="/login"
          class="text-white text-sm md:text-base"
        >
          Masuk
        </UButton>
      </div>
    </div>
  </header>
</template>
