import { boolean, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { userTable } from "./auth";

export const surveiTable = pgTable("survei", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  judul: text().notNull(),
  deskripsi: text(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const pertanyaanTable = pgTable("pertanyaan", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  surveiId: integer()
    .notNull()
    .references(() => surveiTable.id, { onDelete: "cascade" }),
  pertanyaan: text().notNull(),
  wajib: boolean().notNull().default(false),
  nomorUrut: integer().notNull(),
});

export const responTable = pgTable("respon", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  surveiId: integer()
    .notNull()
    .references(() => surveiTable.id, { onDelete: "cascade" }),
  userId: integer().notNull().references(() => userTable.id, { onDelete: "cascade" }),
  dikirimPada: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const jawabanTable = pgTable("jawaban", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  responId: integer()
    .notNull()
    .references(() => responTable.id, { onDelete: "cascade" }),
  pertanyaanId: integer()
    .notNull()
    .references(() => pertanyaanTable.id, { onDelete: "cascade" }),
  jawaban: text().notNull(),
});
