import {
  integer,
  pgTable,
  text,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { userTable } from "./auth";
import { createdUpdated } from "./common";

export const userProfileTable = pgTable("user_profile", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  userId: integer().notNull().references(() => userTable.id, { onDelete: "cascade" }).unique(),
  namaKantor: text(),
  noHp: text(),
  nip18: text(),
  namaJabatan: text(),
  namaUnitEs4: text(),
  namaPangkat: text(),
  pendidikanFormal: text(),
  alamat: text(),
  rt: text(),
  rw: text(),
  ...createdUpdated,
}, table => [
  uniqueIndex("userid_idx_profile").on(table.userId),
]);
