import { date, integer, pgEnum, pgTable, text } from "drizzle-orm/pg-core";
import { createdUpdated } from "./common";
import { iuranKhususTable } from "./iuran";

export const sumberDanaEnum = pgEnum("sumber_dana", ["bulanan", "khusus"]);

export const pengeluaranTable = pgTable("pengeluaran", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  judul: text().notNull(),
  nominal: integer().notNull(),
  tanggal: date({ mode: "string" }).notNull(),
  sumberDana: sumberDanaEnum().notNull(),
  iuranKhususId: integer().references(() => iuranKhususTable.id, { onDelete: "cascade" }),
  ...createdUpdated,
});
