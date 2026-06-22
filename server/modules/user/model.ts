import { z } from "zod";
import { multipartFiles } from "~~/server/utils/schema";

export const updateUserSchema = z.object({
  namaKantor: z.string().optional(),
  noHp: z.string().optional(),
  nip18: z.string().optional(),
  namaJabatan: z.string().optional(),
  namaUnitEs4: z.string().optional(),
  namaPangkat: z.string().optional(),
  pendidikanFormal: z.string().optional(),
  alamat: z.string().optional(),
  rt: z.string().optional(),
  rw: z.string().optional(),
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
