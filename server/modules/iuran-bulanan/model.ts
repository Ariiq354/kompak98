import { z } from "zod";
import { paginationSearchSchema } from "~~/server/utils/schema";

export const createPembayaranBulananSchema = z.object({
  iuranId: z.number().min(1),
  periode: z.array(z.number()).min(1),
});

export type CreatePembayaranBulananSchema = z.infer<typeof createPembayaranBulananSchema>;

export const getUniqueNominalKasBulananSchema = z.object({
  nominal: z.number().positive(),
});

export const getAllUserKasBulananByTahunSchema = z.object({
  ...paginationSearchSchema.shape,
  tahun: z.coerce.number().default(new Date().getFullYear()),
});

export type GetAllUserKasBulananByTahunSchema = z.infer<typeof getAllUserKasBulananByTahunSchema>;

export const getRingkasanKasByTahunSchema = z.object({
  tahun: z.coerce.number().default(new Date().getFullYear()),
});
