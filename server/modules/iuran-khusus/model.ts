import { z } from "zod";

export const createIuranKhususSchema = z.object({
  judul: z.string().min(1),
  deskripsi: z.string().min(1),
  nominalAnjuran: z.number().nonnegative(),
  tanggalAkhir: z.iso.date().optional(),
});

export type CreateIuranKhususSchema = z.infer<typeof createIuranKhususSchema>;

export const updateIuranKhususSchema = createIuranKhususSchema.partial();

export type UpdateIuranKhususSchema = z.infer<typeof updateIuranKhususSchema>;

export const createPembayaranKhususSchema = z.object({
  iuranId: z.number().min(1),
  nominal: z.number().positive(),
});

export type CreatePembayaranKhususSchema = z.infer<typeof createPembayaranKhususSchema>;
