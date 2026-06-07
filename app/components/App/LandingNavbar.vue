<template>
  <header class="fixed top-4 left-1/2 -translate-x-1/2 w-360 h-18 flex items-center justify-between z-20">
    <div class="relative w-full h-full ">
      <div class="absolute w-full h-full border-2 border-eucalyptus-700 rounded-xl bg-white/10  backdrop-blur-[6px]" />
      <div class="absolute inset-0 flex items-center justify-between px-6">
        <div class="flex items-center gap-4">
          <NuxtImg src="/images/logo-kemenag-bogor.png" height="50" />
          <p class="text-eucalyptus-700 font-bold text-2xl">
            Kemenag Bogor
          </p>
        </div>

        <div>
          <ul class="flex items-center gap-5 font-medium">
            <li>
              <NuxtLink to="/">
                Home
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/lacak-laporan">
                Lacak Laporan
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <UButton to="/login" class="bg-eucalyptus-700 hover:bg-eucalyptus-800 rounded-lg text-white py-2 px-6 cursor-pointer">
            Masuk
          </UButton>
        </div>
      </div>
    </div>
  </header>
</template>
