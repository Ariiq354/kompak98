import type { TableColumn } from "@nuxt/ui";
import z from "zod";
import { UBadge } from "#components";

export const schema = z.object({
  id: z.optional(z.number()),
  judul: z.string().min(1, "Judul iuran tidak boleh kosong!"),
  deskripsi: z.string().min(1, "Deskripsi iuran tidak boleh kosong!"),
  nominalAnjuran: z.number().positive("Nominal anjuran tidak boleh kosong!"),
  tanggalAkhir: z.iso.date().optional(),
});

export function getInitialFormDataTagihanKhusus(): Schema {
  return {
    id: undefined,
    judul: "",
    deskripsi: "",
    nominalAnjuran: 0,
    tanggalAkhir: undefined,
  };
}

export type Schema = z.infer<typeof schema>;

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
  {
    accessorKey: "nominal",
    header: "Nominal",
    cell: ({ row }) => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(row.original.nominal);
    },
  },
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
  {
    accessorKey: "tanggalBayar",
    header: "Tanggal Bayar",
    cell: ({ row }) => {
      return formatDate(row.original.tanggalBayar);
    },
  },
  { accessorKey: "aksi", header: "Aksi" },
];

export const iuranKhususColumns: TableColumn<any>[] = [
  { accessorKey: "judul", header: "Nama Tagihan" },
  { accessorKey: "deskripsi", header: "Deskripsi" },
  { accessorKey: "nominalAnjuran", header: "Nominal Anjuran" },
  { accessorKey: "tanggalAkhir", header: "Tanggal Berakhir Iuran" },
  { accessorKey: "aksi", header: "Aksi" },
];

export interface HistoryPembayaran {
  id: number;
  status: "pending" | "menunggu_verifikasi" | "lunas";
  nominal: number;
  tanggalBayar: string | null;
}
