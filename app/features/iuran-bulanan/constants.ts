import type { TableColumn } from "@nuxt/ui";
import z from "zod";
import { MONTH_LABEL } from "~/utils/constant";

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

export const monitoringIuranBulananColumns: TableColumn<any>[] = [
  { accessorKey: "nama", header: "Nama Member" },
  ...MONTH_LABEL.map((label, index) => ({
    accessorKey: `bulan_${index + 1}`,
    header: label,
  })),
  { accessorKey: "aksi", header: "Aksi" },
];

export const iuranKhususColumns: TableColumn<any>[] = [
  { accessorKey: "judul", header: "Nama Tagihan" },
  { accessorKey: "deskripsi", header: "Deskripsi" },
  { accessorKey: "nominalAnjuran", header: "Nominal Anjuran" },
  { accessorKey: "tanggalAkhir", header: "Tanggal Berakhir Iuran" },
  { accessorKey: "aksi", header: "Aksi" },
];
