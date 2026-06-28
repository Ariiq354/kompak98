<template>
  <footer class="bg-navy-950 text-slate-400 pt-16 pb-8 border-t border-navy-900">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <!-- Brand Column -->
        <div class="md:col-span-2 space-y-4">
          <div class="flex items-center gap-3">
            <NuxtImg
              src="/images/logo-vertical.webp"
              alt="KOMPAK 98 Logo"
              width="60"
              class="brightness-110"
            />
            <div>
              <h3 class="text-lg font-bold text-white tracking-wider">
                KOMPAK 98
              </h3>
              <p class="text-xs text-slate-500">
                Everlasting Brotherhood
              </p>
            </div>
          </div>
          <p class="text-sm text-slate-400 max-w-sm">
            Wadah kolaborasi, komunikasi, dan sinergi bagi seluruh alumni KOMPAK 98 untuk terus berkontribusi bagi almamater, masyarakat, dan bangsa.
          </p>
          <div class="flex gap-4 pt-2">
            <a href="#" class="p-2 rounded-lg bg-navy-900 hover:bg-navy-800 text-slate-400 hover:text-white transition-colors" aria-label="Facebook">
              <UIcon name="i-lucide-facebook" class="w-5 h-5" />
            </a>
            <a href="#" class="p-2 rounded-lg bg-navy-900 hover:bg-navy-800 text-slate-400 hover:text-white transition-colors" aria-label="Instagram">
              <UIcon name="i-lucide-instagram" class="w-5 h-5" />
            </a>
            <a href="#" class="p-2 rounded-lg bg-navy-900 hover:bg-navy-800 text-slate-400 hover:text-white transition-colors" aria-label="Twitter">
              <UIcon name="i-lucide-twitter" class="w-5 h-5" />
            </a>
            <a href="#" class="p-2 rounded-lg bg-navy-900 hover:bg-navy-800 text-slate-400 hover:text-white transition-colors" aria-label="Linkedin">
              <UIcon name="i-lucide-linkedin" class="w-5 h-5" />
            </a>
          </div>
        </div>

        <!-- Quick Links Column -->
        <div>
          <h4 class="text-sm font-semibold text-white uppercase tracking-wider mb-4">
            Tautan Pintas
          </h4>
          <ul class="space-y-2.5 text-sm">
            <li>
              <a href="#hero" class="hover:text-white transition-colors">Beranda</a>
            </li>
            <li>
              <a href="#tentang" class="hover:text-white transition-colors">Tentang Kami</a>
            </li>
            <li>
              <a href="#acara" class="hover:text-white transition-colors">Acara Terbaru</a>
            </li>
            <li>
              <a href="#akan-datang" class="hover:text-white transition-colors">Akan Datang</a>
            </li>
          </ul>
        </div>

        <!-- Contact Column -->
        <div>
          <h4 class="text-sm font-semibold text-white uppercase tracking-wider mb-4">
            Hubungi Kami
          </h4>
          <ul class="space-y-3 text-sm">
            <li class="flex items-start gap-2.5">
              <UIcon name="i-lucide-mail" class="w-5 h-5 text-navy-400 shrink-0 mt-0.5" />
              <span>info@kompak98.org</span>
            </li>
            <li class="flex items-start gap-2.5">
              <UIcon name="i-lucide-phone" class="w-5 h-5 text-navy-400 shrink-0 mt-0.5" />
              <span>+62 812-3456-7890</span>
            </li>
            <li class="flex items-start gap-2.5">
              <UIcon name="i-lucide-map-pin" class="w-5 h-5 text-navy-400 shrink-0 mt-0.5" />
              <span>Sekretariat KOMPAK 98, Jakarta Selatan, Indonesia</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Copyright Area -->
      <div class="border-t border-navy-900 pt-8 flex flex-col md:flex-row justify-center items-center gap-4 text-xs">
        <p>&copy; 2026 KOMPAK 98 Alumni Association. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>
