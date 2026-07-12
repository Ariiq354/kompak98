import {
  integer,
  snakeCase,
  text,
} from "drizzle-orm/pg-core";

export const jabatanTable = snakeCase.table("jabatan", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  jabatan: text().notNull(),
  kodeJabatan: text().notNull(),
  jenisJabatan: text().notNull(),
});
