<template>
  <header
    class="sticky top-0 z-30 w-full border-b-2 border-gray-200 bg-white py-4 font-sans"
  >
    <div class="container flex items-center justify-between">
      <div
        class="flex items-center gap-4 font-bold tracking-wider text-black md:text-2xl"
      >
        <NuxtImg src="/images/logo.webp" alt="logo" height="50" />
      </div>
      <UButton
        to="/login"
        class="hidden text-white md:block"
      >
        Masuk
      </UButton>
    </div>
  </header>
</template>
