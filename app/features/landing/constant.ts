import { z } from "zod";

export const baseSchema = z.object({
  judul: z.string().min(1, "Judul laporan wajib diisi"),
  isi: z.string().min(1, "Isi laporan wajib diisi"),
  files: z.optional(
    z
      .file()
      .max(5_000_000)
      .mime([
        "application/pdf",
        "application/msword",
        "image/jpeg",
        "image/png",
      ]),
  ),
});

export const pengaduanSchema = z.object({
  jenis: z.literal("pengaduan"),
  tanggalKejadian: z.iso.date(),
  lokasiKejadian: z.string().min(1, "Lokasi laporan wajib diisi"),
  ...baseSchema.shape,
});

export const aspirasiSchema = z.object({
  jenis: z.literal("aspirasi"),
  asalPelapor: z.string().min(1, "Asal Pelapor wajib diisi"),
  ...baseSchema.shape,
});

export const permintaanInformasiSchema = z.object({
  jenis: z.literal("permintaan_informasi"),
  asalPelapor: z.string().min(1, "Asal Pelapor wajib diisi"),
  ...baseSchema.shape,
});

export const laporanSchema = z.discriminatedUnion("jenis", [
  pengaduanSchema,
  aspirasiSchema,
  permintaanInformasiSchema,
]);

export type LaporanFormSchema = z.infer<typeof laporanSchema>;

export const initialFormDataPengaduan: z.infer<typeof pengaduanSchema> = {
  jenis: "pengaduan",
  judul: "",
  isi: "",
  tanggalKejadian: "",
  lokasiKejadian: "",
  files: undefined,
};

export const initialFormDataAspirasi: z.infer<typeof aspirasiSchema> = {
  jenis: "aspirasi",
  judul: "",
  isi: "",
  asalPelapor: "",
  files: undefined,
};

export const initialFormDataPermintaanInformasi: z.infer<
  typeof permintaanInformasiSchema
> = {
  jenis: "permintaan_informasi",
  judul: "",
  isi: "",
  asalPelapor: "",
  files: undefined,
};

export const initialFormDataByJenis = {
  pengaduan: initialFormDataPengaduan,
  aspirasi: initialFormDataAspirasi,
  permintaan_informasi: initialFormDataPermintaanInformasi,
} as const;
