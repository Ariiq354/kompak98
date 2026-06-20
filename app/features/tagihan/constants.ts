import type { TableColumn } from "@nuxt/ui";
import z from "zod";

export const baseColumns: TableColumn<any>[] = [
  { accessorKey: "judul", header: "Judul" },
  { accessorKey: "deskripsi", header: "Deskripsi" },
  { accessorKey: "nominal", header: "Nominal" },
];

export const createTagihanKhususSchema = z.object({
  id: z.optional(z.number()),
  judul: z.string().min(1, "Judul tagihan tidak boleh kosong!"),
  deskripsi: z.string().min(1, "Deskripsi tagihan tidak boleh kosong!"),
  nominal: z.number().positive("Nominal tagihan tidak boleh kosong!"),
  userIds: z.array(z.number()).min(1, "Silahkan pilih member alumni!"),
});

export function getInitialFormDataTagihanKhusus(): CreateTagihanKhususSchema {
  return {
    id: undefined,
    judul: "",
    deskripsi: "",
    nominal: 0,
    userIds: [],
  };
}

export type CreateTagihanKhususSchema = z.infer<typeof createTagihanKhususSchema>;

export const updateTagihanSchema = createTagihanKhususSchema.omit({ userIds: true }).partial();

export type UpdateTagihanSchema = z.infer<typeof updateTagihanSchema>;

export const updateStatusAdminSchema = z.object({
  status: z.enum(["pending", "menunggu_verifikasi", "lunas"]),
});

export type UpdateStatusAdminSchema = z.infer<typeof updateStatusAdminSchema>;
