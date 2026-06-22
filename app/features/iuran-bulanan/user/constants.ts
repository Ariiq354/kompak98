import type { TableColumn } from "@nuxt/ui";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { h } from "vue";
import z from "zod";
import { UBadge } from "#components";

export const monthLabels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

export const baseColumns: TableColumn<any>[] = [
  { accessorKey: "tahun", header: "Tahun" },
  { accessorKey: "judul", header: "Tagihan" },
  ...monthLabels.map((label, index) => ({
    accessorKey: `bulan_${index + 1}`,
    header: label,
  })),
  { accessorKey: "aksi", header: "Aksi" },
  // {
  //   accessorKey: "status",
  //   header: "Status",
  //   cell: ({ row }) => {
  //     const config = LABEL_STATUS_BAYAR[row.original.status as StatusTagihan];

  //     return h(UBadge, {
  //       color: config.color,
  //       variant: "soft",
  //       label: config.label,
  //     });
  //   },
  // },
];

export function getPendingMonths(
  bulan: {
    bulan: number;
    status: "pending" | "menunggu_verifikasi" | "lunas";
  }[],
) {
  return Array.from({ length: 12 }, (_, index) => index + 1)
    .filter((month) => {
      const data = bulan.find(item => item.bulan === month);

      return !data || data.status === "pending";
    });
}

// export const createTagihanKhususSchema = z.object({
//   id: z.optional(z.number()),
//   judul: z.string().min(1, "Judul tagihan tidak boleh kosong!"),
//   deskripsi: z.string().min(1, "Deskripsi tagihan tidak boleh kosong!"),
//   nominal: z.number().positive("Nominal tagihan tidak boleh kosong!"),
//   userIds: z.array(z.number()).min(1, "Silahkan pilih member alumni!"),
// });

// export function getInitialFormDataTagihanKhusus(): CreateTagihanKhususSchema {
//   return {
//     id: undefined,
//     judul: "",
//     deskripsi: "",
//     nominal: 0,
//     userIds: [],
//   };
// }

// export type CreateTagihanKhususSchema = z.infer<typeof createTagihanKhususSchema>;

// export const updateTagihanSchema = createTagihanKhususSchema.omit({ userIds: true }).partial();

// export type UpdateTagihanSchema = z.infer<typeof updateTagihanSchema>;

// export const updateStatusAdminSchema = z.object({
//   status: z.enum(["pending", "menunggu_verifikasi", "lunas"]),
// });

// export type UpdateStatusAdminSchema = z.infer<typeof updateStatusAdminSchema>;
