import type { TableColumn } from "@nuxt/ui";
import { UBadge } from "#components";
import { MONTH_LABEL } from "~/utils/constant";

export const FILTER_OPTIONS = [
  {
    label: "Belum Bayar",
    value: "belum_bayar",
  },
  {
    label: "Belum Komplit",
    value: "belum_komplit",
  },
  {
    label: "Komplit",
    value: "komplit",
  },
] as const;

export const iuranBulananColumns: TableColumn<any>[] = [
  { accessorKey: "nama", header: "Nama" },
  ...MONTH_LABEL.map((label, index) => ({
    accessorKey: `bulan_${index + 1}`,
    header: () =>
      h("div", {
        class: "text-center w-full",
      }, label),
  })),
  {
    accessorKey: "aksi",
    header: () =>
      h("div", {
        class: "text-center w-full",
      }, "Aksi"),
  },
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
  {
    accessorKey: "aksi",
    header: () =>
      h("div", {
        class: "text-center w-full",
      }, "Aksi"),
  },
];
