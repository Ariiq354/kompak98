import type { TableColumn } from "@nuxt/ui";
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
];

export const historyColumn: TableColumn<any>[] = [
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
