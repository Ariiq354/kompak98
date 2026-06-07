<template>
  <!-- STATUS PENANGANAN -->
  <div class="bg-white p-10 flex flex-col items-center justify-center gap-8 rounded-xl shadow-sm mt-8">
    <div class="w-full flex items-start justify-between">
      <div class="flex flex-col gap-2">
        <p class="text-xl font-semibold">
          Status Penanganan
        </p>
        <p class="text-sm">
          Update terakhir: <span>14 Okt 2024, 09:30 WIB</span>
        </p>
      </div>
      <div class="rounded-full bg-golden-grass-500 text-white px-4 py-1 flex items-center gap-2">
        <UIcon name="i-mdi-rotate-3d-variant" class="rotate-90" />
        <p>Sedang Diproses</p>
      </div>
    </div>
    <div class="w-full flex justify-evenly">
      <div class="flex flex-col items-center justify-center gap-3">
        <div class="flex items-center justify-center rounded-full bg-eucalyptus-700 text-white w-12 h-12">
          <UIcon name="i-material-symbols-check-rounded" class="text-2xl" />
        </div>
        <div class="flex flex-col items-center justify-center">
          <p class="font-semibold text-black">
            Dikirim
          </p>
          <p class="text-sm">
            12 Okt 2026, 10.00
          </p>
        </div>
      </div>
      <div class="flex flex-col items-center justify-center gap-3">
        <div class="flex items-center justify-center rounded-full bg-eucalyptus-700 text-white w-12 h-12">
          <UIcon name="i-material-symbols-check-rounded" class="text-2xl" />
        </div>
        <div class="flex flex-col items-center justify-center">
          <p class="font-semibold text-black">
            Diverifikasi
          </p>
          <p class="text-sm">
            13 Okt 2026, 14.20
          </p>
        </div>
      </div>
      <div class="flex flex-col items-center justify-center gap-3">
        <div class="flex items-center justify-center rounded-full bg-white border border-golden-grass-400 text-golden-grass-400 w-12 h-12">
          <UIcon name="i-ant-design-hourglass-outlined" class="text-2xl" />
        </div>
        <div class="flex flex-col items-center justify-center">
          <p class="font-semibold text-golden-grass-400">
            Diproses
          </p>
          <p class="text-sm">
            14 Okt 2026, 09.30
          </p>
        </div>
      </div>
      <div class="flex flex-col items-center justify-center gap-3">
        <div class="flex items-center justify-center rounded-full bg-white-pointer-100 text-gray-400 w-12 h-12">
          <UIcon name="i-mdi-comment-multiple-outline" class="text-2xl" />
        </div>
        <div class="flex flex-col items-center justify-center">
          <p class="font-semibold  text-gray-400">
            Ditanggapi
          </p>
          <p class="text-sm text-gray-400">
            Menunggu
          </p>
        </div>
      </div>
      <div class="flex flex-col items-center justify-center gap-3">
        <div class="flex items-center justify-center rounded-full bg-white-pointer-100 text-gray-400 w-12 h-12">
          <UIcon name="i-iconoir-double-check" class="text-2xl" />
        </div>
        <div class="flex flex-col items-center justify-center">
          <p class="font-semibold text-gray-400">
            Selesai
          </p>
          <p class="text-sm text-gray-400">
            Menunggu
          </p>
        </div>
      </div>
    </div>
  </div>

  <div class="w-full flex gap-8">
    <!-- DETAIL LAPORAN -->
    <div class="w-full bg-white p-10 flex flex-col items-start justify-center gap-8 rounded-xl shadow-sm mt-8">
      <div class="w-full flex items-center justify-between pb-4 border-b border-gray-300">
        <div class="flex items-center gap-2">
          <UIcon name="i-line-md-file-document" class="text-eucalyptus-700 text-2xl" />
          <p class="text-xl font-semibold">
            Detail Laporan
          </p>
        </div>
        <div class="bg-white-pointer-100 rounded-md px-3 py-1 text-sm text-gray-500 font-semibold">
          ID: GEMA-XXXX-XXXX
        </div>
      </div>

      <div class="grid grid-cols-2 gap-6">
        <div class="flex flex-col">
          <p class="text-sm">
            Kategori
          </p>
          <p class="text-lg font-medium">
            Pelayanan Publik KUA
          </p>
        </div>
        <div class="flex flex-col">
          <p class="text-sm">
            Tanggal Kejadian
          </p>
          <p class="text-lg font-medium">
            10 Juni 2026
          </p>
        </div>
        <div class="flex flex-col">
          <p class="text-sm">
            Lokasi
          </p>
          <p class="text-lg font-medium">
            <UIcon name="i-material-symbols-location-on-outline" class="text-eucalyptus-700" />
            KUA Kecamatan Bogor Tengah
          </p>
        </div>
      </div>

      <div class="bg-white-pointer-100 rounded-xl p-4 flex flex-col gap-2">
        <p class="text-sm">
          Deskripsi Aduan
        </p>
        <p class="text-black text-base">
          Terdapat keterlambatan penerbitan dokumen pencatatan nikah yang dijanjikan selesai dalam 3 hari kerja, namun hingga saat ini (sudah 1 minggu) belum ada kejelasan. Petugas kurang responsif saat dihubungi.
        </p>
      </div>
    </div>

    <!-- TANGGAPAN PETUGAS -->
    <div class="w-3/5 bg-white p-10 rounded-xl shadow-sm mt-8 border-l-4 border-eucalyptus-700">
      <div class="relative">
        <div class="flex items-center gap-2">
          <UIcon name="i-mdi-comment-multiple-outline" class="text-eucalyptus-700 text-4xl" />
          <p class="text-xl font-semibold">
            Tanggapan Petugas
          </p>
        </div>
        <!-- <div class="absolute">
          <UIcon name="i-si-shield-police-fill" class="text-gray-100 text-8xl" />
        </div> -->
      </div>

      <div class="border-l-2 pl-4 border-white-pointer-100 mt-5">
        <div class="relative flex flex-col text-sm mb-8">
          <div class="absolute -left-6 top-1 rounded-full w-3.5 h-3.5 bg-eucalyptus-700 border-2 border-white" />

          <p class="text-eucalyptus-700 font-semibold">
            Admin Kemenag Bogor
          </p>
          <p class="mb-2 text-xs">
            14 Okt 2026. 09.30
          </p>
          <div class="bg-white-pointer-100 rounded-xl py-3 px-4 flex flex-col gap-2">
            <p class="text-black text-base">
              Laporan Anda sedang kami teruskan ke Kepala KUA Bogor Tengah untuk klarifikasi lebih lanjut. Mohon menunggu update selanjutnya.
            </p>
          </div>
        </div>
        <div class="relative flex flex-col text-sm">
          <div class="absolute -left-6 top-1 rounded-full w-3.5 h-3.5 bg-gray-300 border-2 border-white" />

          <p class="text-gray-500 font-semibold">
            Sistem GEMA
          </p>
          <p class="mb-2 text-xs text-gray-400">
            14 Okt 2026. 09.30
          </p>
          <div class="bg-gray-100 rounded-xl py-3 px-4 flex flex-col gap-2">
            <p class="text-gray-400 text-base">
              Laporan Anda sedang kami teruskan ke Kepala KUA Bogor Tengah untuk klarifikasi lebih lanjut. Mohon menunggu update selanjutnya.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
