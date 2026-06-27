import { z } from "zod";
import { paginationSearchSchema } from "~~/server/utils/schema";

export const createPengeluaranSchema = z.object({
  deskripsi: z.string().min(1),
  nominal: z.number().positive(),
  tanggal: z.string(),
  sumberDana: z.enum(["bulanan", "khusus"]),
  iuranKhususId: z.number().optional(),
}).refine(data => data.sumberDana === "bulanan" || data.iuranKhususId != null, {
  message: "iuranKhususId wajib diisi jika sumber dana adalah kas khusus",
  path: ["iuranKhususId"],
});

export type CreatePengeluaranSchema = z.infer<typeof createPengeluaranSchema>;

export const updatePengeluaranSchema = z.object({
  deskripsi: z.string().min(1).optional(),
  nominal: z.number().positive().optional(),
  tanggal: z.string().optional(),
  sumberDana: z.enum(["bulanan", "khusus"]).optional(),
  iuranKhususId: z.number().optional(),
});

export type UpdatePengeluaranSchema = z.infer<typeof updatePengeluaranSchema>;

export const getPengeluaranSchema = z.object({
  ...paginationSearchSchema.shape,
  tahun: z.coerce.number().optional(),
  bulan: z.coerce.number().optional(),
});

export type GetPengeluaranSchema = z.infer<typeof getPengeluaranSchema>;
