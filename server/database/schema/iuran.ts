import {
  date,
  integer,
  pgEnum,
  snakeCase,
  text,
  unique,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { createdUpdated } from "./common";

export const statusEnum = pgEnum("status", ["pending", "menunggu_verifikasi", "lunas"]);

export const iuranKasBulananTable = snakeCase.table("iuran_kas_bulanan", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  judul: text().notNull(),
  nominalPerBulan: integer().notNull(),
  tahun: integer().notNull(),
  ...createdUpdated,
}, table => [
  unique("unique_tahun").on(table.tahun),
]);

export const pembayaranKasBulananTable = snakeCase.table("pembayaran_kas_bulanan", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  iuranId: integer().notNull().references(() => iuranKasBulananTable.id, { onDelete: "cascade" }),
  userId: integer().notNull().references(() => user.id, { onDelete: "cascade" }),
  status: statusEnum().notNull().default("pending"),
  nominal: integer().notNull(),
  tanggalBayar: date({ mode: "string" }),
  ...createdUpdated,
});

export const periodeKasBulananTable = snakeCase.table("periode_kas_bulanan", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  pembayaranId: integer().notNull().references(() => pembayaranKasBulananTable.id, { onDelete: "cascade" }),
  bulan: integer().notNull(),
  ...createdUpdated,
}, table => [
  unique().on(table.pembayaranId, table.bulan),
]);

export const iuranKhususTable = snakeCase.table("iuran_khusus", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  judul: text().notNull(),
  deskripsi: text().notNull(),
  nominalAnjuran: integer().notNull(),
  tanggalAkhir: date({ mode: "string" }),
  ...createdUpdated,
});

export const pembayaranIuranKhususTable = snakeCase.table("pembayaran_iuran_khusus", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  iuranId: integer().notNull().references(() => iuranKhususTable.id, { onDelete: "cascade" }),
  userId: integer().notNull().references(() => user.id, { onDelete: "cascade" }),
  status: statusEnum().notNull().default("pending"),
  nominal: integer().notNull(),
  tanggalBayar: date({ mode: "string" }),
  ...createdUpdated,
});
