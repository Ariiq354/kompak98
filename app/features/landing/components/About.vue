<script setup lang="ts">
const pillars = [
  {
    icon: "i-lucide-users",
    title: "Eratkan Silaturahmi",
    description: "Menghubungkan kembali ratusan alumni KOMPAK 98 lintas daerah untuk memelihara hubungan persaudaraan yang abadi.",
    color: "text-navy-600 bg-navy-50 border-navy-100",
  },
  {
    icon: "i-lucide-shield-check",
    title: "Transparansi Keuangan",
    description: "Sistem monitoring iuran bulanan, iuran khusus, dan laporan pengeluaran dana sosial yang dikelola secara transparan dan akuntabel.",
    color: "text-emerald-600 bg-emerald-50 border-emerald-100",
  },
  {
    icon: "i-lucide-heart-handshake",
    title: "Kepedulian & Sinergi",
    description: "Menggalang aksi sosial, donasi kemanusiaan, serta kolaborasi profesional untuk memberikan dampak positif bagi sesama.",
    color: "text-[#ed1e79] bg-pink-50 border-pink-100",
  },
];
</script>

<template>
  <section id="tentang" class="py-24 md:py-32 bg-white relative overflow-hidden">
    <!-- Glow Decors -->
    <div class="absolute -top-40 -right-40 w-96 h-96 bg-navy-100/30 rounded-full blur-3xl" />
    <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-100/20 rounded-full blur-3xl" />

    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        <!-- Left Side: Brand Story -->
        <div class="lg:col-span-5 space-y-6">
          <span class="text-[#ed1e79] font-bold text-xs md:text-sm uppercase tracking-widest">
            Tentang Alumni
          </span>
          <h2 class="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Menyatukan Potensi, Mempererat Persaudaraan
          </h2>
          <div class="w-16 h-1 bg-[#ed1e79] rounded-full" />
          <p class="text-slate-600 text-base md:text-lg leading-relaxed font-light">
            Alumni <strong>KOMPAK 98</strong> merupakan persatuan alumni yang berkomitmen menjaga semangat kebersamaan dan persaudaraan tanpa batas (Everlasting Brotherhood).
          </p>
          <p class="text-slate-500 text-sm md:text-base leading-relaxed">
            Melalui platform digital terintegrasi ini, kami mempermudah pengelolaan iuran keanggotaan, transparansi laporan pengeluaran, serta koordinasi agenda kegiatan sosial demi kemajuan bersama seluruh anggota alumni.
          </p>

          <div class="pt-4">
            <UButton
              to="/register"
              size="lg"
              class="px-6 py-3 text-white font-medium rounded-xl shadow-lg bg-navy-600 hover:bg-navy-500 transition-all cursor-pointer"
            >
              Gabung Sekarang
            </UButton>
          </div>
        </div>

        <!-- Right Side: Interactive Cards Grid -->
        <div class="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
          <!-- Large Promo Banner inside Grid -->
          <div class="sm:col-span-2 p-8 rounded-3xl bg-linear-to-br from-navy-950 to-navy-900 text-white shadow-xl flex flex-col justify-between min-h-60 relative overflow-hidden">
            <!-- decorative mesh background -->
            <div class="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_bottom_right,#ed1e79_20%,transparent_60%)]" />

            <div class="relative z-10">
              <span class="text-pink-400 font-semibold text-xs uppercase tracking-widest">Visi Utama</span>
              <h3 class="text-2xl font-bold mt-2 mb-4 leading-snug">
                Menjadi Alumni yang Unggul, Saling Mendukung, & Bermanfaat bagi Masyarakat
              </h3>
            </div>
            <div class="relative z-10 flex items-center gap-3 mt-4 text-sm text-slate-300">
              <span class="w-2 h-2 rounded-full bg-pink-400" />
              <span>Kompak, Peduli, & Berkelanjutan</span>
            </div>
          </div>

          <!-- Pillars Cards -->
          <div
            v-for="(pillar, index) in pillars"
            :key="index"
            class="group p-6 md:p-8 rounded-3xl bg-slate-50 border border-slate-200/50 hover:bg-white hover:border-slate-300 hover:shadow-xl transition-all duration-300"
          >
            <div
              class="w-12 h-12 rounded-2xl flex items-center justify-center border font-bold mb-6 transition-transform duration-300 group-hover:scale-110"
              :class="pillar.color"
            >
              <UIcon :name="pillar.icon" class="w-6 h-6" />
            </div>
            <h4 class="text-lg font-bold text-slate-900 mb-2">
              {{ pillar.title }}
            </h4>
            <p class="text-slate-500 text-xs md:text-sm leading-relaxed">
              {{ pillar.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
