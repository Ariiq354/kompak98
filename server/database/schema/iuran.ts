import {
  date,
  integer,
  pgEnum,
  pgTable,
  text,
  unique,
} from "drizzle-orm/pg-core";
import { userTable } from "./auth";
import { createdUpdated } from "./common";

export const statusEnum = pgEnum("status", ["pending", "lunas"]);

export const iuranKasBulananTable = pgTable("iuran_kas_bulanan", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  judul: text().notNull(),
  deskripsi: text().notNull(),
  nominalPerBulan: integer().notNull(),
  tahun: integer().notNull(),
  ...createdUpdated,
}, table => [
  unique("unique_tahun").on(table.tahun),
]);

export const pembayaranKasBulananTable = pgTable("pembayaran_kas_bulanan", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  iuranId: integer().notNull().references(() => iuranKasBulananTable.id, { onDelete: "cascade" }),
  userId: integer().notNull().references(() => userTable.id, { onDelete: "cascade" }),
  status: statusEnum().notNull().default("pending"),
  nominal: integer().notNull(),
  tanggalBayar: date({ mode: "string" }).notNull(),
  ...createdUpdated,
});

export const periodeKasBulananTable = pgTable("periode_kas_bulanan", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  pembayaranId: integer().notNull().references(() => pembayaranKasBulananTable.id, { onDelete: "cascade" }),
  bulan: integer().notNull(),
  ...createdUpdated,
}, table => [
  unique().on(table.pembayaranId, table.bulan),
]);

export const iuranKhususTable = pgTable("iuran_khusus", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  judul: text().notNull(),
  deskripsi: text().notNull(),
  nominalAnjuran: integer().notNull(),
  tanggalAkhir: date({ mode: "string" }),
  ...createdUpdated,
});

export const pembayaranIuranKhususTable = pgTable("pembayaran_iuran_khusus", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  iuranId: integer().notNull().references(() => iuranKhususTable.id, { onDelete: "cascade" }),
  userId: integer().notNull().references(() => userTable.id, { onDelete: "cascade" }),
  status: statusEnum().notNull().default("pending"),
  nominal: integer().notNull(),
  tanggalBayar: date({ mode: "string" }).notNull(),
  ...createdUpdated,
});
