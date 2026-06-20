import type { TableColumn } from "@nuxt/ui";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { h } from "vue";
import z from "zod";
import { UBadge } from "#components";

export interface TagihanSaya {
  id: number;
  judul: string;
  deskripsi: string;
  nominal: number;
  status: StatusTagihan;
  tanggalBayar: Date | string | null;
}

export const baseColumns: TableColumn<TagihanSaya>[] = [
  { accessorKey: "judul", header: "Tagihan" },
  { accessorKey: "deskripsi", header: "Deskripsi" },
  { accessorKey: "nominal", header: "Nominal" },
];

export const baseColumnTagihanSaya: TableColumn<TagihanSaya>[] = [
  ...baseColumns,
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const config = LABEL_STATUS_BAYAR[row.original.status];

      return h(UBadge, {
        color: config.color,
        variant: "soft",
        label: config.label,
      });
    },
  },
  {
    accessorKey: "tanggalBayar",
    header: "Tanggal Bayar",
    cell: ({ row }) =>
      row.original.tanggalBayar
        ? format(new Date(row.original.tanggalBayar), "d MMMM yyyy", {
            locale: id,
          })
        : "-",
  },
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
