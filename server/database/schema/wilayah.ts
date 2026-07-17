import { integer, snakeCase, text } from "drizzle-orm/pg-core";

export const provinsiTable = snakeCase.table("provinsi", {
  id: integer().primaryKey(),
  provinsi: text().notNull(),
});

export const kotaTable = snakeCase.table("kota", {
  id: integer().primaryKey(),
  idProvinsi: integer().notNull().references(() => provinsiTable.id),
  kota: text().notNull(),
});
