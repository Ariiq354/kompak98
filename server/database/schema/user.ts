import {
  integer,
  pgTable,
  text,
} from "drizzle-orm/pg-core";
import { userTable } from "./auth";
import { createdUpdated } from "./common";

export const userProfileTable = pgTable("user_profile", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  userId: integer().notNull().references(() => userTable.id, { onDelete: "cascade" }),
  namaKantor: text(),
  noHp: text(),
  nip9: text(),
  nip18: text(),
  namaJabatan: text(),
  namaUnitEs4: text(),
  namaPangkat: text(),
  pendidikanFormal: text(),
  alamat: text(),
  rt: text(),
  rw: text(),
  ...createdUpdated,
});
