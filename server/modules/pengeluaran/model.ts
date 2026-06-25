import { z } from "zod";

export const createPengeluaranSchema = z.object({
  judul: z.string().min(1),
  nominal: z.number().positive(),
  tanggal: z.string(),
  sumberDana: z.enum(["bulanan", "khusus"]),
  iuranKhususId: z.number().optional(),
}).refine(data => data.sumberDana === "bulanan" || data.iuranKhususId != null, {
  message: "iuranKhususId wajib diisi jika sumber dana adalah kas khusus",
  path: ["iuranKhususId"],
});

export type CreatePengeluaranSchema = z.infer<typeof createPengeluaranSchema>;
