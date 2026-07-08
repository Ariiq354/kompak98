import type { TableColumn } from "@nuxt/ui";
import type { PageSearch } from "~/utils/types";
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import z from "zod";
import { UBadge } from "#components";
import { formatDateIndo } from "~/utils";

export interface QueryParams extends PageSearch {
  tahun?: number;
  bulan?: number;
}

const LABEL_STATUS_SUMBER_DANA = {
  bulanan: { color: "primary", label: "Bulanan" },
  khusus: { color: "success", label: "Khusus" },
} as const;

export const columns: TableColumn<any>[] = [
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
  { accessorKey: "deskripsi", header: "Deskripsi" },
  {
    accessorKey: "sumberDana",
    header: "Sumber Dana",
    cell: ({ row }) => {
      const config = LABEL_STATUS_SUMBER_DANA[row.original.sumberDana as keyof typeof LABEL_STATUS_SUMBER_DANA];

      return h(UBadge, {
        color: config.color,
        variant: "soft",
        label: config.label,
      });
    },
  },
  {
    accessorKey: "tanggal",
    header: "Tanggal",
    cell: ({ row }) => {
      return formatDateIndo(row.original.tanggal);
    },
  },
];

export const schema = z.object({
  id: z.number().optional(),
  deskripsi: z.string().min(1, "Deskripsi pengeluaran tidak boleh kosong!"),
  nominal: z.number().positive("Nominal tidak boleh kosong!"),
  tanggal: z.instanceof(CalendarDate),
  sumberDana: z.enum(["bulanan", "khusus"]),
  iuranKhususId: z.number().optional(),
}).refine(data => data.sumberDana === "bulanan" || data.iuranKhususId != null, {
  message: "Iuran khusus wajib diisi jika sumber dana adalah kas khusus",
  path: ["iuranKhususId"],
});

export const initFormData: Schema = {
  id: undefined,
  deskripsi: "",
  nominal: 0,
  tanggal: today(getLocalTimeZone()),
  sumberDana: "bulanan",
  iuranKhususId: undefined,
};

export type Schema = z.infer<typeof schema>;

export const sumberDanaOptions = [
  { label: "Bulanan", value: "bulanan" },
  { label: "Khusus", value: "khusus" },
];
