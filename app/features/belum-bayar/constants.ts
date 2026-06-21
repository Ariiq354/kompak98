import type { TableColumn } from "@nuxt/ui";
import { h } from "vue";
import { UBadge } from "#components";

export const columns: TableColumn<any>[] = [
  { accessorKey: "judul", header: "Tagihan" },
  { accessorKey: "namaAnggota", header: "Nama" },
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
  { accessorKey: "aksi", header: "Aksi" },
];
