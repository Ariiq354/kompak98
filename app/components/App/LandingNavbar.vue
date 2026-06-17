<template>
  <header
    class="sticky top-0 z-30 w-full border-b-2 border-gray-200 bg-white py-4 font-sans"
  >
    <div class="container flex items-center justify-between">
      <div
        class="flex items-center gap-4 font-bold tracking-wider text-black md:text-2xl"
      >
        <NuxtImg src="/logo.webp" alt="logo" class="h-10 md:h-14" />
        <div class="flex flex-col">
          <h1
            class="font-title text-2xl font-bold tracking-[0.35em] text-black leading-none"
          >
            KOMPAK
          </h1>

          <div
            class="font-sub uppercase tracking-[0.28em] text-base mt-2"
          >
            <span class="text-neutral-800">SEMBILAN</span>
            <span class="text-indigo-700">DELAPAN</span>
          </div>
        </div>
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
