import { date, integer, snakeCase, text } from "drizzle-orm/pg-core";
import { createdUpdated } from "./common";

export const acaraTable = snakeCase.table("acara", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  foto: text().notNull(),
  judul: text().notNull(),
  deskripsi: text().notNull(),
  tempat: text().notNull(),
  tanggal: date({ mode: "string" }).notNull(),
  ...createdUpdated,
});
