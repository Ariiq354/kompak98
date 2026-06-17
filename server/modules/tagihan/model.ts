import { z } from "zod";

export const createTagihanKhususSchema = z.object({
  judul: z.string().min(1),
  deskripsi: z.string().min(1),
  jenis: z.string().min(1),
  nominal: z.number().positive(),
  userIds: z.array(z.number()).min(1),
});

export type CreateTagihanKhususSchema = z.infer<typeof createTagihanKhususSchema>;

export const updateTagihanSchema = createTagihanKhususSchema.omit({ userIds: true }).partial();

export type UpdateTagihanSchema = z.infer<typeof updateTagihanSchema>;

export const updateStatusAdminSchema = z.object({
  status: z.enum(["pending", "menunggu_verifikasi", "lunas"]),
});

export type UpdateStatusAdminSchema = z.infer<typeof updateStatusAdminSchema>;
