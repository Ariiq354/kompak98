import type { TableColumn } from "@nuxt/ui";
import type { StatusTagihan } from "~/utils/types";
import { UBadge } from "#components";
import { formatDateIndo } from "~/utils";
import { MONTH_LABEL } from "~/utils/constant";
import { LABEL_STATUS_BAYAR } from "~/utils/types";

export const iuranBulananColumns: TableColumn<any>[] = [
  { accessorKey: "tahun", header: "Tahun" },
  { accessorKey: "judul", header: "Iuran" },
  ...MONTH_LABEL.map((label, index) => ({
    accessorKey: `bulan_${index + 1}`,
    header: label,
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
