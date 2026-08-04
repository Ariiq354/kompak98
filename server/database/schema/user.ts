import {
  integer,
  snakeCase,
  text,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { createdUpdated } from "./common";
import { jabatanTable } from "./jabatan";
import { kotaTable, provinsiTable } from "./wilayah";

export const userProfileTable = snakeCase.table("user_profile", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  userId: integer().notNull().references(() => user.id, { onDelete: "cascade" }).unique(),
  gender: text({ enum: ["Laki-laki", "Perempuan"] }),
  namaKantor: text(),
  provinsiKantorId: integer().references(() => provinsiTable.id, { onDelete: "set null" }),
  noHp: text(),
  nip18: text(),
  idJabatan: integer().references(() => jabatanTable.id, { onDelete: "set null" }),
  namaUnitEs4: text(),
  namaPangkat: text(),
  pendidikanFormal: text(),
  alamat: text(),
  provinsiId: integer().references(() => provinsiTable.id, { onDelete: "set null" }),
  kotaId: integer().references(() => kotaTable.id, { onDelete: "set null" }),
  ...createdUpdated,
}, table => [
  uniqueIndex("userid_idx_profile").on(table.userId),
]);
