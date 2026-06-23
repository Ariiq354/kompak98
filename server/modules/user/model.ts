import { z } from "zod";
import { multipartFiles } from "~~/server/utils/schema";

export const updateUserSchema = z.object({
  gender: z.enum(["Laki-laki", "Perempuan"]).optional(),
  namaKantor: z.string().optional(),
  provinsiKantor: z.string().optional(),
  noHp: z.string().optional(),
  nip18: z.string().optional(),
  namaJabatan: z.string().optional(),
  namaUnitEs4: z.string().optional(),
  namaPangkat: z.string().optional(),
  pendidikanFormal: z.string().optional(),
  alamat: z.string().optional(),
  provinsi: z.string().optional(),
  kota: z.string().optional(),
  file: multipartFiles({
    maxCount: 1,
    maxSize: 5 * 1024 * 1024, // 5 MB
    fileTypes: [
      "image/jpeg",
      "image/png",
      "image/webp",
    ],
  }),
  foto: z.string(),
});

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
