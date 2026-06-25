import type { TableColumn } from "@nuxt/ui";
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import z from "zod";

export const columns: TableColumn<any>[] = [
  { accessorKey: "nominal", header: "Nominal" },
  { accessorKey: "judul", header: "Judul" },
  { accessorKey: "sumberDana", header: "Sumber Dana" },
  { accessorKey: "tanggal", header: "Tanggal Pengeluaran" },
];

export const schema = z.object({
  judul: z.string().min(1, "Judul pengeluaran tidak boleh kosong!"),
  nominal: z.number().positive("Nominal tidak boleh kosong!"),
  tanggal: z.instanceof(CalendarDate),
  sumberDana: z.enum(["bulanan", "khusus"]),
  iuranKhususId: z.number().optional(),
}).refine(data => data.sumberDana === "bulanan" || data.iuranKhususId != null, {
  message: "Iuran khusus wajib diisi jika sumber dana adalah kas khusus",
  path: ["iuranKhususId"],
});

export const initFormData: Schema = {
  judul: "",
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
