import { boolean, integer, snakeCase, text, timestamp } from "drizzle-orm/pg-core";
import { userTable } from "./auth";

export const surveiTable = snakeCase.table("survei", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  judul: text().notNull(),
  deskripsi: text(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const pertanyaanTable = snakeCase.table("pertanyaan", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  surveiId: integer()
    .notNull()
    .references(() => surveiTable.id, { onDelete: "cascade" }),
  pertanyaan: text().notNull(),
  wajib: boolean().notNull().default(false),
  nomorUrut: integer().notNull(),
});

export const responTable = snakeCase.table("respon", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  surveiId: integer()
    .notNull()
    .references(() => surveiTable.id, { onDelete: "cascade" }),
  userId: integer().notNull().references(() => userTable.id, { onDelete: "cascade" }),
  dikirimPada: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const jawabanTable = snakeCase.table("jawaban", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  responId: integer()
    .notNull()
    .references(() => responTable.id, { onDelete: "cascade" }),
  pertanyaanId: integer()
    .notNull()
    .references(() => pertanyaanTable.id, { onDelete: "cascade" }),
  jawaban: text().notNull(),
});
