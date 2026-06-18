<template>
  <div class="min-h-screen w-full flex bg-black">
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
    <slot />
  </div>
</template>
