import type { TableColumn } from "@nuxt/ui";
import { CalendarDate } from "@internationalized/date";
import { z } from "zod";
import { UBadge } from "#components";

export const schema = z.object({
  id: z.optional(z.number()),
  judul: z.string().min(1, "Judul iuran tidak boleh kosong!"),
  deskripsi: z.string().min(1, "Deskripsi iuran tidak boleh kosong!"),
  nominalAnjuran: z.number().positive("Nominal anjuran tidak boleh kosong!"),
  tanggalAkhir: z.instanceof(CalendarDate).optional(),
});

export const initFormData: Schema = {
  id: undefined,
  judul: "",
  deskripsi: "",
  nominalAnjuran: 0,
  tanggalAkhir: undefined,
};

export type Schema = z.infer<typeof schema>;

export const historyIuranKhususColumn: TableColumn<any>[] = [
  {
    accessorKey: "namaUser",
    header: "Nama User",
  },
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
  {
    accessorKey: "aksi",
    header: () =>
      h("div", {
        class: "text-center w-full",
      }, "Aksi"),
  },
];

export const iuranKhususColumns: TableColumn<any>[] = [
  { accessorKey: "judul", header: "Nama Tagihan" },
  { accessorKey: "deskripsi", header: "Deskripsi" },
  {
    accessorKey: "nominalAnjuran",
    header: "Nominal Anjuran",
    cell: ({ row }) => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(row.original.nominalAnjuran);
    },
  },
  {
    accessorKey: "nominalTerkumpul",
    header: "Nominal Terkumpul",
    cell: ({ row }) => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(row.original.nominalTerkumpul);
    },
  },
  { accessorKey: "tanggalAkhir", header: "Tanggal Berakhir Iuran", cell: ({ row }) => formatDate(row.original.tanggalAkhir) },
];
