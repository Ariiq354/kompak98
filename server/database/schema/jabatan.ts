import {
  integer,
  pgTable,
  text,
} from "drizzle-orm/pg-core";

export const jabatanTable = pgTable("jabatan", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  jabatan: text().notNull(),
  kodeJabatan: text().notNull(),
  jenisJabatan: text().notNull(),
});
