import { bigint, boolean, integer, pgTable, text } from "drizzle-orm/pg-core";
import { userTable } from "./auth";
import { createdUpdated } from "./common";

export const galeriTable = pgTable("galeri", {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  name: text().notNull(),
  isFolder: boolean().notNull().default(false),
  parentId: integer().references((): any => galeriTable.id, { onDelete: "cascade" }),
  mimeType: text(),
  extension: text(),
  originalName: text(),
  path: text(),
  size: bigint({ mode: "number" }),
  createdBy: integer().references(() => userTable.id, { onDelete: "set null" }),
  ...createdUpdated,
});
