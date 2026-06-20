import type { TableColumn } from "@nuxt/ui";
import type { TagihanSaya } from "../tagihan/constants";
import { h } from "vue";
import { UBadge } from "#components";

export const baseColumns: TableColumn<TagihanSaya>[] = [
  { accessorKey: "judul", header: "Tagihan" },
  { accessorKey: "namaAnggota", header: "Nama" },
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
];
