import type { TableColumn } from "@nuxt/ui";
import type { PageSearch } from "~/utils/types";
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import z from "zod";
import { formatDateIndo } from "~/utils";

export interface QueryParams extends PageSearch {
  tahun?: number;
  bulan?: number;
}

export const columns: TableColumn<any>[] = [
  { accessorKey: "judul", header: "Judul" },
  { accessorKey: "deskripsi", header: "Deskripsi" },
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
  judul: z.string().min(1, "Deskripsi acara tidak boleh kosong!"),
  deskripsi: z.string().min(1, "Deskripsi acara tidak boleh kosong!"),
  tanggal: z.instanceof(CalendarDate),
  tempat: z.string().min(1, "Tempat acara tidak boleh kosong!"),
  foto: z.string().optional(),
  file: z.optional(z.file()
    .check(
      z.maxSize(5_000_000),
      z.mime(["image/png", "image/jpeg", "image/webp"]),
    )),
});

export const initFormData: Partial<Schema> = {
  id: undefined,
  judul: "",
  deskripsi: "",
  tempat: "",
  tanggal: today(getLocalTimeZone()),
  foto: undefined,
  file: undefined,
};

export type Schema = z.infer<typeof schema>;
