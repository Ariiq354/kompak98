import {
  integer,
  pgTable,
  text,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { userTable } from "./auth";
import { createdUpdated } from "./common";
import { jabatanTable } from "./jabatan";

export const userProfileTable = pgTable("user_profile", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  userId: integer().notNull().references(() => userTable.id, { onDelete: "cascade" }).unique(),
  gender: text({ enum: ["Laki-laki", "Perempuan"] }),
  namaKantor: text(),
  provinsiKantor: text(),
  noHp: text(),
  nip18: text(),
  idJabatan: integer().references(() => jabatanTable.id, { onDelete: "set null" }),
  namaUnitEs4: text(),
  namaPangkat: text(),
  pendidikanFormal: text(),
  alamat: text(),
  provinsi: text(),
  kota: text(),
  ...createdUpdated,
}, table => [
  uniqueIndex("userid_idx_profile").on(table.userId),
]);
