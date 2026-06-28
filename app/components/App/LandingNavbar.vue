<script setup lang="ts">
import { ref } from "vue";

const isMobileMenuOpen = ref(false);

const navLinks = [
  { label: "Beranda", href: "#hero" },
  { label: "Acara", href: "#acara" },
  { label: "Akan Datang", href: "#akan-datang" },
  { label: "Tentang", href: "#tentang" },
];

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false;
}
</script>

<template>
  <header class="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-md border-b border-slate-200/50 transition-all duration-300">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 md:h-20">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2 group">
          <NuxtImg
            src="/images/logo-horizontal.webp"
            alt="logo"
            class="h-9 md:h-12 w-auto transition-transform duration-300 group-hover:scale-105"
          />
        </NuxtLink>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center gap-8">
          <a
            v-for="link in navLinks"
            :key="link.label"
            :href="link.href"
            class="text-sm font-medium text-slate-600 hover:text-navy-600 transition-colors duration-200 relative after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-navy-600 after:transition-all after:duration-300 hover:after:w-full"
          >
            {{ link.label }}
          </a>
        </nav>

        <!-- CTA & Actions -->
        <div class="hidden md:flex items-center gap-4">
          <UButton
            to="/login"
            variant="solid"
            class="px-5 py-2 text-white font-medium rounded-xl shadow-md shadow-navy-600/10 hover:shadow-navy-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Masuk
          </UButton>
        </div>

        <!-- Mobile Menu Toggle Button -->
        <div class="md:hidden flex items-center">
          <UButton
            icon="i-lucide-menu"
            variant="ghost"
            color="neutral"
            square
            aria-label="Toggle menu"
            @click="toggleMobileMenu"
          />
        </div>
      </div>
    </div>

    <!-- Mobile Navigation Drawer -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="translate-y-[-10px] opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-[-10px] opacity-0"
    >
      <div v-if="isMobileMenuOpen" class="md:hidden border-t border-slate-200/50 bg-white/95 backdrop-blur-md px-4 pt-4 pb-6 space-y-3 shadow-xl">
        <a
          v-for="link in navLinks"
          :key="link.label"
          :href="link.href"
          class="block px-4 py-2.5 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100 hover:text-navy-600 transition-all"
          @click="closeMobileMenu"
        >
          {{ link.label }}
        </a>
        <div class="pt-4 border-t border-slate-100 px-4">
          <UButton
            to="/login"
            class="w-full justify-center text-white"
            @click="closeMobileMenu"
          >
            Masuk
          </UButton>
        </div>
      </div>
    </Transition>
  </header>
</template>
