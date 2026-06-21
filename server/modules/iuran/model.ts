import { z } from "zod";

export interface CreateTagihanKhususSchema {
  judul: string;
  deskripsi: string;
  tahun: number;
  nominalPerBulan: number;
}

export const createPembayaranBulananSchema = z.object({
  iuranId: z.number().min(1),
  nominal: z.number().positive(),
  periode: z.array(z.number()).min(1),
});

export type CreatePembayaranBulananSchema = z.infer<typeof createPembayaranBulananSchema>;
