import type { TableColumn } from "@nuxt/ui";

export const columns: TableColumn<any>[] = [
  { accessorKey: "nominal", header: "Nominal" },
  { accessorKey: "deskripsi", header: "Deskripsis" },
  { accessorKey: "jenis", header: "Jenis Kas" },
  { accessorKey: "tanggal", header: "Tanggal Pengeluaran" },
];

export const DUMMY_DATA = [
  { nominal: 10000, deskripsi: "TEST", jenis: "KHUSUS", tanggal: "10 Jan 2025" },
  { nominal: 10000, deskripsi: "TEST", jenis: "BULANAN", tanggal: "10 Jan 2025" },
  { nominal: 10000, deskripsi: "TEST", jenis: "KHUSUS", tanggal: "10 Jan 2025" },
];
