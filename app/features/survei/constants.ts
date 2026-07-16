import type { TableColumn } from "@nuxt/ui";
import type { PageSearch } from "~/utils/types";
import { CalendarDate } from "@internationalized/date";
import { h } from "vue";
import z from "zod";
import { UBadge } from "#components";
import { formatDateIndo } from "~/utils";

export interface QueryParams extends PageSearch {
  limit?: number;
  status?: "draft" | "published";
}

export const columns: TableColumn<any>[] = [
  { accessorKey: "judul", header: "Judul Survei" },
  { accessorKey: "deskripsi", header: "Deskripsi" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return h(UBadge, {
        color: status === "published" ? "success" : "neutral",
        variant: "subtle",
        label: status === "published" ? "Published" : "Draft",
      });
    },
  },
  {
    accessorKey: "createdAt",
    header: "Tanggal Dibuat",
    cell: ({ row }) => formatDateIndo(row.original.createdAt),
  },
];

export const schema = z.object({
  id: z.number().optional(),
  judul: z.string().min(1, "Judul survei tidak boleh kosong!"),
  deskripsi: z.string().optional(),
  headerGambar: z.string().optional(),
  status: z.enum(["draft", "published"]).default("draft"),
  tanggalMulai: z.instanceof(CalendarDate).optional(),
  tanggalSelesai: z.instanceof(CalendarDate).optional(),
  pertanyaan: z.array(z.object({
    id: z.number().optional(),
    tipe: z.enum(["short_text", "long_text", "single_choice", "multiple_choice", "dropdown", "rating"]),
    pertanyaan: z.string().min(1, "Teks pertanyaan tidak boleh kosong!"),
    wajib: z.boolean().default(false),
    nomorUrut: z.number().int().nonnegative(),
    pilihan: z.array(z.string()).optional(),
  })).optional(),
});

export type Schema = z.infer<typeof schema>;

export const initFormData: Partial<Schema> = {
  id: undefined,
  judul: "",
  deskripsi: undefined,
  headerGambar: undefined,
  status: "draft",
  tanggalMulai: undefined,
  tanggalSelesai: undefined,
  pertanyaan: [],
};

export interface JawabanState {
  pertanyaanId: number;
  pertanyaanText: string;
  tipe: "short_text" | "long_text" | "single_choice" | "multiple_choice" | "dropdown" | "rating";
  wajib: boolean;
  pilihan?: string[] | null;
  jawaban: any; // Can be string, number, or string[]
}
