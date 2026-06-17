import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { userTable } from "./auth";
import { createdUpdated } from "./common";

export const statusEnum = pgEnum("status", ["pending", "menunggu_verifikasi", "lunas"]);

export const tagihanTable = pgTable("tagihan", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  judul: text().notNull(),
  deskripsi: text().notNull(),
  jenis: text().notNull(),
  nominal: integer().notNull(),
  ...createdUpdated,
});

export const tagihanAnggotaTable = pgTable("tagihan_anggota", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  tagihanId: integer().notNull().references(() => tagihanTable.id, { onDelete: "cascade" }),
  userId: integer().notNull().references(() => userTable.id, { onDelete: "cascade" }),
  status: statusEnum().notNull().default("pending"),
  tanggalBayar: timestamp({ withTimezone: true }),
  ...createdUpdated,
}, table => [
  uniqueIndex("tagihan_anggota_tagihan_user_idx").on(
    table.tagihanId,
    table.userId,
  ),
]);
