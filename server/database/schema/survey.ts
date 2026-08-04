import { boolean, date, integer, jsonb, pgEnum, snakeCase, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { createdUpdated } from "./common";

export const statusSurveiEnum = pgEnum("status_survei", ["draft", "published"]);
export const tipePertanyaanEnum = pgEnum("tipe_pertanyaan", [
  "short_text",
  "long_text",
  "single_choice",
  "multiple_choice",
  "dropdown",
  "rating",
]);

export const surveiTable = snakeCase.table("survei", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  judul: text().notNull(),
  deskripsi: text(),
  headerGambar: text(),
  status: statusSurveiEnum().notNull().default("draft"),
  tanggalMulai: date({ mode: "string" }),
  tanggalSelesai: date({ mode: "string" }),
  createdBy: integer()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  ...createdUpdated,
});

export const pertanyaanTable = snakeCase.table("pertanyaan", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  surveiId: integer()
    .notNull()
    .references(() => surveiTable.id, { onDelete: "cascade" }),
  tipe: tipePertanyaanEnum().notNull(),
  pertanyaan: text().notNull(),
  wajib: boolean().notNull().default(false),
  nomorUrut: integer().notNull(),
  pilihan: jsonb().$type<string[]>(),
  ...createdUpdated,
});

export const responTable = snakeCase.table("respon", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  surveiId: integer()
    .notNull()
    .references(() => surveiTable.id, { onDelete: "cascade" }),
  userId: integer().notNull().references(() => user.id, { onDelete: "cascade" }),
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
  jawaban: jsonb().notNull(),
});
