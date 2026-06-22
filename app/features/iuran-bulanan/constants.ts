import type { TableColumn } from "@nuxt/ui";
import z from "zod";
import { UBadge } from "#components";

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

export const iuranBulananColumns: TableColumn<any>[] = [
  { accessorKey: "tahun", header: "Tahun" },
  { accessorKey: "judul", header: "Tagihan" },
  ...monthLabels.map((label, index) => ({
    accessorKey: `bulan_${index + 1}`,
    header: label,
  })),
  { accessorKey: "aksi", header: "Aksi" },
];

export const monitoringIuranBulananColumns: TableColumn<any>[] = [
  { accessorKey: "nama", header: "Nama Member" },
  ...monthLabels.map((label, index) => ({
    accessorKey: `bulan_${index + 1}`,
    header: label,
  })),
  { accessorKey: "aksi", header: "Aksi" },
];

export const historyIuranBulananColumn: TableColumn<any>[] = [
  { accessorKey: "nominal", header: "Nominal" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const config = LABEL_STATUS_BAYAR[row.original.status as StatusTagihan];

      return h(UBadge, {
        color: config.color,
        variant: "soft",
        label: config.label,
      });
    },
  },
  { accessorKey: "tanggalBayar", header: "Tanggal Bayar" },
  { accessorKey: "aksi", header: "Aksi" },
];

export const iuranKhususColumns: TableColumn<any>[] = [
  { accessorKey: "judul", header: "Nama Tagihan" },
  { accessorKey: "deskripsi", header: "Deskripsi" },
  { accessorKey: "nominalAnjuran", header: "Nominal Anjuran" },
  { accessorKey: "tanggalAkhir", header: "Tanggal Berakhir Iuran" },
  { accessorKey: "aksi", header: "Aksi" },
];

export function getAvailMonths(
  bulan: {
    bulan: number;
    status: "pending" | "menunggu_verifikasi" | "lunas";
  }[],
) {
  const paidMonths = bulan.map(item => item.bulan);

  return Array.from({ length: 12 }, (_, index) => index + 1)
    .filter(month => !paidMonths.includes(month));
}

export function getStatusConfig(status?: string) {
  switch (status) {
    case "lunas":
      return {
        icon: "i-lucide-check",
        class: "bg-primary text-white",
      };

    case "menunggu_verifikasi":
      return {
        icon: "i-lucide-hourglass",
        class: "bg-red-50 text-red-400",
      };

    case "pending":
      return {
        icon: "i-lucide-clock-4",
        class: "bg-yellow-50 text-orange-400",
      };

    default:
      return {
        icon: "i-lucide-minus",
        class: "bg-gray-100 text-gray-600",
      };
  }
}

export function getStatusLabel(status?: string) {
  switch (status) {
    case "lunas":
      return "Sudah dibayar";

    case "menunggu_verifikasi":
      return "Menuggu verifikasi pembayaran oleh admin";

    case "pending":
      return "Menunggu transfer pembayaran oleh member";

    default:
      return "Belum ada pembayaran";
  }
}
