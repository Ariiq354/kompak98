import { z } from "zod";
import { multipartFiles, paginationSearchSchema } from "~~/server/utils/schema";

export const createAcaraSchema = z.object({
  judul: z.string().min(1),
  deskripsi: z.string().min(1),
  tempat: z.string().min(1),
  tanggal: z.iso.date(),
  file: multipartFiles({
    minCount: 1,
    maxCount: 1,
    maxSize: 5 * 1024 * 1024,
    fileTypes: ["image/jpeg", "image/png", "image/webp"],
  }),
});

export type CreateAcaraSchema = z.infer<typeof createAcaraSchema>;

export const updateAcaraSchema = z.object({
  judul: z.string().min(1).optional(),
  deskripsi: z.string().min(1).optional(),
  tempat: z.string().min(1).optional(),
  tanggal: z.iso.date().optional(),
  file: multipartFiles({
    maxCount: 1,
    maxSize: 5 * 1024 * 1024,
    fileTypes: ["image/jpeg", "image/png", "image/webp", "application/pdf"],
  }).optional(),
});

export type UpdateAcaraSchema = z.infer<typeof updateAcaraSchema>;

export const getAcaraSchema = z.object({
  ...paginationSearchSchema.shape,
  tahun: z.coerce.number().optional(),
  bulan: z.coerce.number().optional(),
});

export type GetAcaraSchema = z.infer<typeof getAcaraSchema>;
