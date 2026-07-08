import type { TableColumn } from "@nuxt/ui";
import type { StatusTagihan } from "~/utils/types";
import { UBadge } from "#components";
import { formatDateIndo } from "~/utils";
import { LABEL_STATUS_BAYAR } from "~/utils/types";

export const historyIuranKhususColumn: TableColumn<any>[] = [
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
      return formatDateIndo(row.original.tanggalBayar);
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
  { accessorKey: "judul", header: "Nama Iuran" },
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
  { accessorKey: "tanggalAkhir", header: "Tanggal Berakhir Iuran", cell: ({ row }) => formatDateIndo(row.original.tanggalAkhir) },
  {
    accessorKey: "aksi",
    header: () =>
      h("div", {
        class: "text-center w-full",
      }, "Aksi"),
  },
];
