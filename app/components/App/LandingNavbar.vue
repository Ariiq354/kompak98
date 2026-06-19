<template>
  <header
    class="py-4"
  >
    <div class="container mx-auto">
      <div class="flex items-center justify-between">
        <div
          class="flex items-center gap-4 font-bold tracking-wider text-black md:text-2xl"
        >
          <NuxtImg src="/images/logo-horizontal.webp" alt="logo" height="50" />
        </div>
        <UButton
          to="/login"
          class="hidden text-white md:block"
        >
          Masuk
        </UButton>
      </div>
    </div>
  </header>
</template>
