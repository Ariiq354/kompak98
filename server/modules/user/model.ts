import { z } from "zod";
import { multipartFiles } from "~~/server/utils/schema";

export const updateUserSchema = z.object({
  namaKantor: z.string().min(1).optional(),
  noHp: z.string().min(1).optional(),
  nip18: z.string().min(1).optional(),
  namaJabatan: z.string().min(1).optional(),
  namaUnitEs4: z.string().min(1).optional(),
  namaPangkat: z.string().min(1).optional(),
  pendidikanFormal: z.string().min(1).optional(),
  alamat: z.string().min(1).optional(),
  rt: z.string().min(1).optional(),
  rw: z.string().min(1).optional(),
  file: multipartFiles({
    maxCount: 1,
    maxSize: 5 * 1024 * 1024, // 5 MB
    fileTypes: [
      "image/jpeg",
      "image/png",
      "image/webp",
    ],
  }),
});

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
