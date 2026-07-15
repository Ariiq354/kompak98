import { z } from "zod";
import { multipartFile, paginationSearchSchema } from "~~/server/utils/schema";

export const updateUserSchema = z.object({
  gender: z.enum(["Laki-laki", "Perempuan"]).optional(),
  namaKantor: z.string().optional(),
  provinsiKantor: z.string().optional(),
  noHp: z.string().optional(),
  nip18: z.string().optional(),
  idJabatan: z.coerce.number().optional(),
  namaUnitEs4: z.string().optional(),
  namaPangkat: z.string().optional(),
  pendidikanFormal: z.string().optional(),
  alamat: z.string().optional(),
  provinsi: z.string().optional(),
  kota: z.string().optional(),
  file: multipartFile({
    maxSize: 5 * 1024 * 1024,
    fileTypes: ["image/jpeg", "image/png", "image/webp"],
  }).optional(),
  foto: z.string().optional(),
});

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;

export const getMonitoringUserSchema = z.object({
  ...paginationSearchSchema.shape,
  kodeJabatan: z.string().optional(),
});

export type GetMonitoringUserSchema = z.infer<typeof getMonitoringUserSchema>;
