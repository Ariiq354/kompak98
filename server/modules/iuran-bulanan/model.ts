import { z } from "zod";
import { paginationSearchSchema } from "~~/server/utils/schema";

export const createPembayaranBulananSchema = z.object({
  iuranId: z.number().min(1),
  periode: z.array(z.number()).min(1),
});

export type CreatePembayaranBulananSchema = z.infer<typeof createPembayaranBulananSchema>;

export const getKasBulananByTahunSchema = z.object({
  ...paginationSearchSchema.shape,
  tahun: z.coerce.number().default(new Date().getFullYear()),
  filter: z.enum(["belum_bayar", "belum_komplit", "komplit"]).optional(),
});

export type GetKasBulananByTahunSchema = z.infer<typeof getKasBulananByTahunSchema>;

export const getRingkasanKasByTahunSchema = z.object({
  tahun: z.coerce.number().default(new Date().getFullYear()),
});

export const getDetailKasByTahunSchema = z.object({
  userId: z.coerce.number(),
});
